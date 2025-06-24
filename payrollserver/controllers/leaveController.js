import LeaveRequest from '../models/LeaveRequest.js';

export const applyLeave = async (req, res) => {
  try {
    const employee = req.user._id;
    const { reason, startDate, endDate } = req.body;

    const leave = new LeaveRequest({ employee, reason, startDate, endDate });
    await leave.save();

    res.status(201).json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to apply for leave' });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate('employee', 'name');
    res.status(200).json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch leave requests' });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await LeaveRequest.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update leave status' });
  }
};

export const getMyLeaveRequests = async (req, res) => {
  try {
    const employee = req.user._id;
    const leaves = await LeaveRequest.find({ employee }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch your leave requests' });
  }
};
