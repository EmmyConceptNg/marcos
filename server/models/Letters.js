import mongoose from "mongoose";
import { type } from "os";

const LettersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    send: { type: Boolean, default: false },
    letterPaths: [
      {
        bureau: String,
        path: String,
        content: String,
      },
    ],
  },
  { timestamps: true }
);

const Letters = mongoose.model("Letters", LettersSchema);

export default Letters;
