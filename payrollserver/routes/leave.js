import express from 'express';
import {
  applyLeave,
  getAllLeaveRequests,
  updateLeaveStatus
} from '../controllers/leaveController.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', verifyUser, applyLeave);
router.get('/all', verifyUser, getAllLeaveRequests);
router.put('/update/:id', verifyUser, updateLeaveStatus);

export default router;
