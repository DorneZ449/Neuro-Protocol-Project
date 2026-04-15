import { Router } from 'express';
import { getInteractions, createInteraction, deleteInteraction } from '../controllers/interactionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getInteractions);
router.post('/', createInteraction);
router.delete('/:id', deleteInteraction);

export default router;
