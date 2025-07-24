import { Router } from 'express';
import { getDiagnosis, analyzeDrug, getAIHistory, getUsageStats } from '@/controllers/aiController';
import { authenticateToken, requireDoctorOrPatient, aiLimiter } from '@/middleware';
import { validateRequest, diagnosisSchema, drugAnalysisSchema } from '@/middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);
router.use(requireDoctorOrPatient);

// AI service routes with rate limiting
router.post('/diagnose', aiLimiter, validateRequest(diagnosisSchema), getDiagnosis);
router.post('/drug-analyze', aiLimiter, validateRequest(drugAnalysisSchema), analyzeDrug);

// History and stats routes
router.get('/history', getAIHistory);
router.get('/usage-stats', getUsageStats);

export default router;