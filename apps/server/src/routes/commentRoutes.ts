import { Router } from 'express';
import { createComment, getComments, updateComment, deleteComment } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';

const router = Router();

router.use(authenticate, requireTenant);

router.post('/', createComment);
router.get('/', getComments);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
