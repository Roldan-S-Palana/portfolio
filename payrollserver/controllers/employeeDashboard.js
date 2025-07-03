// controllers/employeeDashboard.js
import Attendance from "../models/Attendance.js";
import Leave from "../models/LeaveRequest.js";
import Payroll from "../models/Payroll.js";

export const getEmployeeDashboardStats = async (req, res) => {
  try {
    const employeeId = req.user._id;

    // 🕘 Today's Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendanceToday = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    // 📝 Latest 5 Leaves
    const latestLeaves = await Leave.find({ employee: employeeId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 💰 Latest Payroll
    const latestPayroll = await Payroll.findOne({ employee: employeeId })
      .sort({ endDate: -1 });

    res.json({
      success: true,
      dashboard: {
        attendanceToday,
        latestLeaves,
        latestPayroll,
      },
    });
  } catch (err) {
    console.error("Employee Dashboard Error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard data",
    });
  }
};
