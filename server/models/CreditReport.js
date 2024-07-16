import mongoose from 'mongoose';

const CreditReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creditReportData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    round : {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const CreditReport = mongoose.model('CreditReport', CreditReportSchema);

export default CreditReport;
