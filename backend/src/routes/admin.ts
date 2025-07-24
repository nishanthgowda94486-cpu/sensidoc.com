import { Router } from 'express';
import { 
  getDashboardStats, 
  getUsers, 
  getDoctors, 
  verifyDoctor, 
  getAppointments, 
  getLoginLogs, 
  updateUserMembership 
} from '@/controllers/adminController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard and statistics
router.get('/stats', getDashboardStats);
router.get('/login-logs', getLoginLogs);

// User management
router.get('/users', getUsers);
router.put('/users/:userId/membership', updateUserMembership);

// Doctor management
router.get('/doctors', getDoctors);
router.put('/doctors/:doctorId/verify', verifyDoctor);

// Appointment management
router.get('/appointments', getAppointments);

export default router;