import Credit from "../models/Credit.js";
import stripePackage from "stripe";
import { decrypt, encrypt } from "../utils/Index.js";
import User from "../models/User.js";

// Credit controller
export const getCredit = async (req, res) => {
  // Handle GET request for Credit
  try {
    const items = await Credit.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCredit = async (req, res) => {
  // Handle POST request to create Credit
  try {
    const newItem = new Credit(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const initializeCredit = async (req, res) => {
  const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
  const domain = process.env.APP_URL;

  const { balance } = req.body;

  const creditMultiplier = parseFloat(process.env.CREDIT_AMOUNT);

  const amount = balance * creditMultiplier * 100;

  const hashedAmmount = encrypt(amount);

  const successUrl = `${domain}/dashboard/credit/success/{CHECKOUT_SESSION_ID}/${hashedAmmount.content}/${hashedAmmount.iv}`;
  const cancelUrl = `${domain}/dashboard/credit/cancel`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Credit",
              description: "credits",
              // images: ['https://example.com/image.png'],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
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

export const addUserCredit = async (req, res) => {
  const { amount, userId, iv } = req.body;

  const getUser = await User.findOne({ _id: userId });
  const newBalance = getUser.balance + (Number(decrypt({iv, content:amount})) / 100);

  User.findOneAndUpdate({ _id: userId }, { balance: newBalance }, { new: true })
   .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } }, 
      })
      .populate("documents")
      .populate("letters")
      .select("-password")
    .then((user) =>
      res.status(200).json({ user, message: "User Balance Added Successfully" })
    );
};
// Add more controller methods as needed
