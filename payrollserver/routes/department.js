import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addDepartment, getDepartments, deleteDepartment, updateDepartment } from "../controllers/departmentController.js";

const router = express.Router();
router.post("/add", authMiddleware, addDepartment);
router.get("/all", authMiddleware, getDepartments);
router.delete("/:id", deleteDepartment);
router.put("/:id", updateDepartment);
export default router;
