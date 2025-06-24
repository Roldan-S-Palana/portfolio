import express from "express";
import multer from "multer";
import {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/all", auth, getAllEmployees);
router.post("/add", auth, upload.single("image"), addEmployee);
router.put("/update/:id", auth, upload.single("image"), updateEmployee);
router.delete("/delete/:id", auth, deleteEmployee);

export default router;
