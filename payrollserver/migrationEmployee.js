// migrateEmployees.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Employee from "./models/Employee.js"; // your old model
import User from "./models/User.js"; // your new user model

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const migrate = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    const employees = await Employee.find();
    const hashedPassword = await bcrypt.hash("password123", 12);

    const userDocs = employees.map(emp => ({
      name: emp.name,
      email: emp.email || `${emp.name.toLowerCase()}@example.com`,
      password: hashedPassword,
      role: "employee",
    }));

    await User.insertMany(userDocs);
    console.log("✅ Migration done! 🎉");

    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrate();
