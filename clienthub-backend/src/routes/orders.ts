import { Router } from 'express';
import { createOrder, updateOrder, deleteOrder } from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
