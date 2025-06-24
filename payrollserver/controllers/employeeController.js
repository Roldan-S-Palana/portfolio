// ✅ Updated Controller (employeeController.js)
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get all employee users
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).sort({ createdAt: -1 });
    res.json({ success: true, employees });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch employees" });
  }
};

// Add new employee
export const addEmployee = async (req, res) => {
  try {
    const { name, position, department, email } = req.body;

    if (!name || !position || !email) {
      return res.status(400).json({ success: false, error: "Required fields missing" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const newEmp = new User({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      position,
      department,
      profileImage: req.file?.filename,
    });

    await newEmp.save();
    res.status(201).json({ success: true, employee: newEmp });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.profileImage = req.file.filename;
    }

    const updated = await User.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, employee: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Update failed" });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Delete failed" });
  }
};
