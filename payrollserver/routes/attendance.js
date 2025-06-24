import express from 'express';
import { markAttendance, getMyAttendance, getAllAttendance } from '../controllers/attendanceController.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/mark', verifyUser, markAttendance);
router.get('/all', verifyUser, getAllAttendance);//Admin only
router.get('/me', verifyUser, getMyAttendance);


export default router;
