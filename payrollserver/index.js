import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path'; // ← for resolving upload paths

// Routes
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRoutes from './routes/employee.js';
import attendanceRouter from './routes/attendance.js';
import leaveRouter from './routes/leave.js';

// Connect to DB
import connectToDatabase from './db/db.js';
connectToDatabase();

const app = express();

// CORS config
app.use(cors({
  origin: "http://localhost:5173", // allow frontend
  credentials: true
}));

// Body parser
app.use(express.json());

// 🔥 Serve static images from /uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRoutes); // 💡 This must come *before* listen()
app.use('/api/attendance', attendanceRouter);
app.use('/api/leaves', leaveRouter);


// MongoDB connect
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

