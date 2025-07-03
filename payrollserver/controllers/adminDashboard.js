import User from "../models/User.js";
import Department from "../models/Department.js";
import Payroll from "../models/Payroll.js";
import Leave from "../models/LeaveRequest.js";

// GET /api/dashboard/admin
export const getAdminDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const totalEmployees = await User.countDocuments({ role: "employee" });
    const departments = await Department.countDocuments();

    // Sum total payroll amount
    const totalPayrollAgg = await Payroll.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalPayroll = totalPayrollAgg[0]?.total || 0;

    // Leave status counts
    const leaveStats = await Leave.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const leaveMap = {};
    leaveStats.forEach((item) => {
      leaveMap[item._id] = item.count;
    });

    const totalLeaveApplied = leaveStats.reduce(
      (sum, stat) => sum + stat.count,
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        departments,
        totalPayroll,
        leaveApplied: totalLeaveApplied,
        leavePending: leaveMap["Pending"] || 0,
        leaveApproved: leaveMap["Approved"] || 0,
        leaveRejected: leaveMap["Rejected"] || 0,
      },
    });

    console.log("📊 Stats received:", res.data.stats);


  } catch (error) {
    console.error("📊 Dashboard Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};
