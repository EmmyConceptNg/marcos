import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    
    priceId: {
      type: String,
      default: null, // Stripe price ID is null for free plans
    },
    productId: {
      type: String,
      default: null, // Stripe price ID is null for free plans
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    recurring: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model('Plan', PlanSchema);

export default Plan;
