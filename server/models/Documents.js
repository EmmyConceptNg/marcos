import mongoose from 'mongoose';

const DocumentsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: String, 
    path : String, 
  },
  { timestamps: true }
);

const Documents = mongoose.model('Documents', DocumentsSchema);

export default Documents;
