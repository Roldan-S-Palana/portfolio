// 👇 Load environment variables before using them
import dotenv from 'dotenv';
dotenv.config(); // ⬅️ Make sure this is at the top


import User from './models/User.js';
import bcryptjs from 'bcryptjs';
import connectToDatabase from './db/db.js';

const userRegister = async () => {
  await connectToDatabase();

  try {
    // Hash password
    const hashPassword = await bcryptjs.hash("admin", 10);

    // === Create Admin User ===
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists.");
    } else {
      const newAdmin = new User({
        name: "admin",
        email: "admin@gmail.com",
        password: hashPassword,
        role: "admin"
      });
      await newAdmin.save();
      console.log("✅ Admin user created.");
    }

    // === Create Employee User ===
    const existingEmployee = await User.findOne({ email: "employee@gmail.com" });
    if (existingEmployee) {
      console.log("⚠️ Employee user already exists.");
    } else {
      const newEmployee = new User({
        name: "Juan Dela Cruz",
        email: "employee@gmail.com",
        password: hashPassword,
        role: "employee"
      });
      await newEmployee.save();
      console.log("✅ Employee user created.");
    }

  } catch (e) {
    console.log("❌ Error creating users:", e);
  }
};

userRegister();
