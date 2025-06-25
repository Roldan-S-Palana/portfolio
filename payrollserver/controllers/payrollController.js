import Payroll from "../models/Payroll.js";

// Admin - Get all payroll records
// Admin - Get all payroll records with search, pagination, and sorting
import mongoose from "mongoose";

export const getAllPayrolls = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const match = {};

    if (status) match.status = status;

    // Base aggregation stages
    const pipeline = [
      {
        $lookup: {
          from: "users", // your employee collection is probably stored as "users"
          localField: "employee",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      { $match: match },
    ];

    // Apply search by employee name
    if (search) {
      pipeline.push({
        $match: {
          "employee.name": { $regex: search, $options: "i" },
        },
      });
    }

    // Count total documents (before pagination)
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Payroll.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Sorting
    const sortObj = {};
    sortObj[sortField] = sortOrder === "asc" ? 1 : -1;

    // Add sort, skip, limit
    pipeline.push({ $sort: sortObj });
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: parseInt(limit) });

    // Run final query
    const payrolls = await Payroll.aggregate(pipeline);

    res.json({
      success: true,
      payrolls,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Failed to fetch payrolls:", err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Employee - Get my payroll history
export const getMyPayrolls = async (req, res) => {
  try {
    const employee = req.user._id;
    const payrolls = await Payroll.find({ employee }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, payrolls });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch your payrolls" });
  }
};

// Admin - Create payroll (optional for now)
export const createPayroll = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const {
      employee: employeeId,
      allowance,
      deduction,
      startDate,
      endDate,
      basic,
      amount,
      status,
    } = req.body;

    const payroll = new Payroll({
      employee: employeeId,
      basic,
      allowance,
      deduction,
      startDate,
      endDate,
      basic,
      amount,
      status,
    });

    await payroll.save();

    res.status(201).json({ success: true, payroll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to create payroll" });
  }
};
