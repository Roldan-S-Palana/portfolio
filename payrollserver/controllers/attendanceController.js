import Attendance from '../models/Attendance.js';

export const markAttendance = async (req, res) => {
  try {
    const { date, status, checkIn, checkOut } = req.body;
    const employee = req.user._id;

    const attendance = new Attendance({ employee, date, status, checkIn, checkOut });
    await attendance.save();

    res.status(201).json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to mark attendance' });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('employee', 'name');
    res.status(200).json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch attendance records' });
  }
};
