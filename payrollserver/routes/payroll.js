import express from "express";
import {
  getAllPayrolls,
  getMyPayrolls,
  createPayroll
} from "../controllers/payrollController.js";
import verifyUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin
router.get("/all", verifyUser, getAllPayrolls);
router.post("/", verifyUser, createPayroll);

// Employee
router.get("/me", verifyUser, getMyPayrolls);

export default router;
