import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    fileName: String,
    fileType: String,
    filePath: String,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    errorCheckComplete: {
      type: Boolean,
      default: false,
    },
    errorsDetected: [
      {
        field: String,
        message: String,
      },
    ],
  },
  { timestamps: true }
);

const Record = mongoose.model('Record', RecordSchema);

export default Record;
