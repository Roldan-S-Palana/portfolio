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

    const range = req.query.range || "this_month";

    let payrollMatch = {};

    if (range === "this_month") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      payrollMatch.startDate = { $gte: startOfMonth, $lt: endOfMonth };
    } else if (range === "last_3_months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      payrollMatch.startDate = { $gte: threeMonthsAgo };
    }

    const totalEmployees = await User.countDocuments({ role: "employee" });
    const departments = await Department.countDocuments();

    const totalPayrollAgg = await Payroll.aggregate([
      { $match: payrollMatch },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalPayroll = totalPayrollAgg[0]?.total || 0;

    const leaveStats = await Leave.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const leaveMap = {};
    leaveStats.forEach((item) => {
      leaveMap[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        departments,
        totalPayroll,
        leaveApplied: leaveMap["Applied"] || 0,
        leavePending: leaveMap["Pending"] || 0,
        leaveApproved: leaveMap["Approved"] || 0,
        leaveRejected: leaveMap["Rejected"] || 0,
      },
    });
  } catch (error) {
    console.error("📊 Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

