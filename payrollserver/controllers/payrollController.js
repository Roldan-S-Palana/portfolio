import Payroll from "../models/Payroll.js";

// Admin - Get all payroll records
export const getAllPayrolls = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const payrolls = await Payroll.find().populate("employee", "name position");
    res.status(200).json({ success: true, payrolls });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch payrolls" });
  }
};

// Employee - Get my payroll history
export const getMyPayrolls = async (req, res) => {
  try {
    const employee = req.user._id;
    const payrolls = await Payroll.find({ employee }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, payrolls });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch your payrolls" });
  }
};

// Admin - Create payroll (optional for now)
export const createPayroll = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { employee:employeeId, allowance, deduction, startDate, endDate, basic, amount, status} = req.body;

    const payroll = new Payroll({
      employee: employeeId,
      basic,
      allowance,
      deduction,
      startDate,
      endDate,
      basic,
      amount,
      status: status || "Pending",
    });

    await payroll.save();

    res.status(201).json({ success: true, payroll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to create payroll" });
  }
};
