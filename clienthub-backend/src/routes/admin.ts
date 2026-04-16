import { Router } from 'express';
import { getAllData } from '../controllers/adminController';
import { changeUserRole } from '../controllers/userRoleController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

const router = Router();

router.use(authMiddleware, adminMiddleware);
router.get('/data', getAllData);
router.put('/users/:userId/role', changeUserRole);

export default router;
