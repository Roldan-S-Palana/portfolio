import express from 'express';
import multer from 'multer';
import { getAllEmployees, addEmployee } from '../controllers/employeeController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

router.get('/all', auth, getAllEmployees);
router.post('/add', auth, upload.single('image'), addEmployee); // ← this handles file upload

export default router;
