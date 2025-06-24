import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  basic: {
    type: Number,
    required: true,
  },
  allowance: {
    type: Number,
    required: true,
  },
  deduction: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true, // Net Pay (basic + allowance - deduction)
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid", "Processing"],
    default: "Unpaid",
  },
}, { timestamps: true });

export default mongoose.model("Payroll", payrollSchema);
