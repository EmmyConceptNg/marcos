import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    fullName: String,
    username: String,
    phone: String,
    currency: String,
    timeZone: String,
    dob: Date,
    otp: String,
    presentAddress: String,
    permAddress: String,
    city: String,
    postalCode: String,
    country: String,
    password: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email address is required"],
      match: [/.+\@.+\..+/, "Please use a valid email address"],
      lowercase: true,
      trim: true,
    },
    type: { type: String, enum: ["user", "business"], default: "user" },
    emailVerified: { type: Boolean, default: false },
    userId: { type: String },
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    creditReport: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreditReport",
    }],
    letters: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Letters",
    },
    planStartDate: {
      type: Date,
      default: Date.now,
    },
    planEndDate: {
      type: Date,
    },
    plaidAccessToken: String,
    plaidItemId: String,
    image: String,
    ssn: Number,
    ssnVerified: { type: String },
    balance: {type:Number, default :0},
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Documents",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", schema);
