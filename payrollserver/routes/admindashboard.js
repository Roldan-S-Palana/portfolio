import express from "express";
import { getAdminDashboardStats } from  "../controllers/adminDashboard.js";
import verifyUser from '../middleware/authMiddleware.js';


// GET /api/admin/dashboard
const router = express.Router();

router.get("/",verifyUser, getAdminDashboardStats);

export default router;

