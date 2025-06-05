import User from './models/User.js';
import bcryptjs from 'bcryptjs';
import connectToDatabase from './db/db.js';

const userRegister = async () => {
  await connectToDatabase();

  try {
    // Check if admin already exists
    const existing = await User.findOne({ email: "admin@gmail.com" });
    if (existing) {
      console.log("⚠️ Admin user already exists.");
      return;
    }

    // Create new admin user
    const hashPassword = await bcryptjs.hash("admin", 10);
    const newUser = new User({
      name: "admin",
      email: "admin@gmail.com",
      password: hashPassword,
      role: "admin"
    });

    await newUser.save();
    console.log("✅ Admin user created.");
  } catch (e) {
    console.log("❌ Error creating admin user:", e);
  }
};

userRegister();
