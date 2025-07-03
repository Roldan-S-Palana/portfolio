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
import payrollRouter from './routes/payroll.js';
import adminDashRouter from './routes/admindashboard.js';
import employeeDashBRoutes from "./routes/employeedashboard.js"; // ✅ ADD THIS


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
app.use('/api/employee', employeeRoutes); 
app.use('/api/attendance', attendanceRouter);
app.use('/api/leaves', leaveRouter);
app.use('/api/payroll', payrollRouter);
app.use('/api/admin-dashboard', adminDashRouter);
app.use('/api/employee-dashboard', employeeDashBRoutes);


// Server + Routes Logger
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);

  // Safely log all registered routes
  setTimeout(() => {
    if (app._router && app._router.stack) {
      app._router.stack
        .filter(r => r.route)
        .forEach(r => {
          const methods = Object.keys(r.route.methods)
            .map(m => m.toUpperCase())
            .join(', ');
          console.log(`${methods} ${r.route.path}`);
        });
    } else {
      console.log("⚠️ No routes found in router stack.");
    }
  }, 100);
});
