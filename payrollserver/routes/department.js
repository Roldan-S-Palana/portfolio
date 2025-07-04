import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addDepartment, getDepartments, deleteDepartment, updateDepartment, addPositionToDepartment, addPositionToAllDepartments } from "../controllers/departmentController.js";

const router = express.Router();
router.post("/add", authMiddleware, addDepartment);
router.post("/:id/position", addPositionToDepartment); // single department (frontend expects /position)
router.post("/positions/add-to-all", addPositionToAllDepartments); // all departments
router.get("/all", authMiddleware, getDepartments);
router.delete("/:id", deleteDepartment);
router.put("/:id", updateDepartment);
export default router;
