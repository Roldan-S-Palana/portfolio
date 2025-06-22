import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'On Leave'],
    default: 'Present'
  },
  checkIn: String,
  checkOut: String,
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
