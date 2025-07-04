import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeCount: { type: Number, required: true },
  description: { type: String },
  positions: [{
    name: { type: String, required: true },
    description: { type: String }
  }],
  head: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
