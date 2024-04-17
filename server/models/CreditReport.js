import mongoose from 'mongoose';

const CreditReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creditReportData: {
      // This will allow dynamic keys for the credit report entries
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const CreditReport = mongoose.model('CreditReport', CreditReportSchema);

export default CreditReport;
