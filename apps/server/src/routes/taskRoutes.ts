import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';
import { requireRole } from '../middleware/role';
import { Role } from '../models/Member';

const router = Router();

// All task routes require authentication and tenant context
router.use(authenticate, requireTenant);

router.post('/', requireRole([Role.ADMIN, Role.MEMBER]), createTask);
router.get('/', getTasks);
router.patch('/:id', requireRole([Role.ADMIN, Role.MEMBER]), updateTask);
router.delete('/:id', requireRole([Role.ADMIN, Role.MEMBER]), deleteTask);

export default router;
