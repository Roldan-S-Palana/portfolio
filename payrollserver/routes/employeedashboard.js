// routes/dashboardRoutes.js
import express from "express";
import { getEmployeeDashboardStats } from "../controllers/employeeDashboard.js";
import verifyUser from "../middleware/authMiddleware.js";

const router = express.Router();



// Employee dashboard route
router.get("/showstat", verifyUser, getEmployeeDashboardStats);

export default router;
