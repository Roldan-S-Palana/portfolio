// controllers/attendanceController.js
import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  try {
    const employee = req.user._id;
    const { type, time } = req.body; // type = 'in' | 'out'

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({
      employee,
      date: today,
    });

    if (!record) {
      // First time in
      record = new Attendance({
        employee,
        date: today,
        checkIn: type === "in" ? time : null,
        checkOut: type === "out" ? time : null,
      });
    } else {
      // Already has record, update only if not already filled
      if (type === "in" && !record.checkIn) {
        record.checkIn = time;
      } else if (type === "out" && !record.checkOut) {
        record.checkOut = time;
      } else {
        return res
          .status(400)
          .json({ success: false, error: "Already marked" });
      }
    }

    await record.save();
    res.status(200).json({ success: true, attendance: record });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.user._id }).sort({
      date: -1,
    });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch records" });
  }
};

//ADMIN_ONLY
// controllers/attendanceController.js
export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("employee", "name email role")
      .sort({ date: -1 });
      
    console.log(res.data); // debug
    res.json({ success: true, records });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch attendance records" });
  }
};
