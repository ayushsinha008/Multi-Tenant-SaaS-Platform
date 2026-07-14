import { Router } from 'express';
import { getActivityLogs } from '../controllers/activityController';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';
import { requireRole } from '../middleware/role';
import { Role } from '../models/Member';

const router = Router();

router.use(authenticate, requireTenant);

router.get('/', requireRole([Role.ADMIN]), getActivityLogs);

export default router;
