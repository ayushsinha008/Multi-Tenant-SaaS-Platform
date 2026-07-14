import { Router } from 'express';
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';
import { requireRole } from '../middleware/role';
import { Role } from '../models/Member';

const router = Router();

// All project routes require authentication and tenant context
router.use(authenticate, requireTenant);

router.post('/', requireRole([Role.ADMIN, Role.MEMBER]), createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.patch('/:id', requireRole([Role.ADMIN, Role.MEMBER]), updateProject);
router.delete('/:id', requireRole([Role.ADMIN]), deleteProject);

export default router;
