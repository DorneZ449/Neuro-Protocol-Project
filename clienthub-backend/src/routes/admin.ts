import { Router } from 'express';
import { getAllData } from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/data', authMiddleware, getAllData);

export default router;
