import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getDashboardStats);

export default router;
