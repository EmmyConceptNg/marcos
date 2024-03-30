import Subscription from "../models/Subscription.js";
import stripePackage from "stripe";
import os from "os";
import Plan from "../models/Plan.js";
import User from "../models/User.js";

// Subscription controller
export const getSubscription = async (req, res) => {
  // Handle GET request for Subscription
  try {
    const items = await Subscription.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createSubscription = async (req, res) => {
  const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
  const { sessionId, planId, userId } = req.body;

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Extract subscription details from the session
    const stripeCustomerId = session.customer;
    const stripeSubscriptionId = session.subscription;

    // Retrieve the full subscription object
    const subscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );

    const plan = await Plan.findById(planId).lean(); // Convert to a JS object

    // Create a new subscription in your database
    const newSubscription = new Subscription({
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      plan: planId, 
      status: subscription.status,
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      autoRenew: true,
    });

    await newSubscription.save();
    const savedSubscription = newSubscription.toObject(); // Convert to a JS object

    // Update the user with the new subscription information
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        subscriptionPlan: planId,
        planStartDate: new Date(subscription.current_period_start * 1000),
        planEndDate: new Date(subscription.current_period_end * 1000),
      },
      { new: true, lean: true } // Return the updated document as a plain object
    ).populate('subscriptionPlan');

    res.status(201).json({ subscription: savedSubscription, user });
  } catch (error) {
    console.error("Error handling subscription success:", error);
    res.status(500).json({ message: error.message });
  }
};


export const initializeSubscription = async (req, res) => {
  const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
  const domain = process.env.APP_URL;

  // Find the plan in your database
  const plan = await Plan.findOne({ _id: req.body.planId });
  if (!plan) {
    return res
      .status(404)
      .json({ message: `Plan  not found` });
  }

  const successUrl = `${domain}/dashboard/subscription/success/{CHECKOUT_SESSION_ID}/${plan._id}`;
  const cancelUrl = `${domain}/dashboard/subscription/cancel`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId, // Use the Stripe price ID from your plan
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Add any other required checkout settings
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createSubscriptionPlan = async (req, res) => {
  const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
  const { productName, productDescription, productPrice, currency } = req.body;

  try {
    const product = await stripe.products.create({
      name: productName,
      description: productDescription,
    });

    const price = await stripe.prices.create({
      unit_amount: productPrice * 100,
      currency: currency,
      recurring: { interval: "month" }, // Could also be 'day', 'week', 'year', etc.
      product: product.id, // Link this price to the product created above
    });

    const plan = await Plan.create({
      name: productName,
      description: productDescription,
      price: productPrice,
      currency: currency,
      recurring: "monthly",
      priceId: price.id,
      productId: product.id,
    });

    return res
      .status(200)
      .json({
        message: "Subscription plan created with price ID:",
        price: price.id,
        plan,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create subscription plan:", err });
  }
};


export const getSubscriptionPlans = (req, res) => {
  Plan.find({})
    .sort({ createdAt: -1 })
    .then((plans) => {
      res.status(200).json(plans);
    })
    .catch((err) => {
      console.error("Error fetching plans:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};
