import express from 'express';
import { markAttendance, getAllAttendance } from '../controllers/attendanceController.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/mark', verifyUser, markAttendance);
router.get('/all', verifyUser, getAllAttendance);

export default router;
