import mongoose from 'mongoose';

const LettersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    letterPaths: [
      {
        bureau: String,
        path: String,
      },
    ],
  },
  { timestamps: true }
);

const Letters = mongoose.model('Letters', LettersSchema);

export default Letters;
