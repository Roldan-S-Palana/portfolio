import express from 'express';
import {
  applyLeave,
  getAllLeaveRequests,
  updateLeaveStatus,
  getMyLeaveRequests
} from '../controllers/leaveController.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', verifyUser, applyLeave);
router.get('/all', verifyUser, getAllLeaveRequests);//Admin Only also
router.put('/:id', verifyUser, updateLeaveStatus);
router.get('/me', verifyUser, getMyLeaveRequests); 
export default router;
