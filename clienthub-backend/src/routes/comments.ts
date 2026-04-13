import { Router } from 'express';
import { createComment, deleteComment } from '../controllers/commentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createComment);
router.delete('/:id', deleteComment);

export default router;
