import { Router } from 'express';
import { getAllData } from '../controllers/adminController';
import { changeUserRole } from '../controllers/userRoleController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/data', authMiddleware, getAllData);
router.put('/users/:userId/role', authMiddleware, changeUserRole);

export default router;
