import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';

const router = Router();

router.use(authenticate, requireTenant);

router.get('/', getDashboardAnalytics);

export default router;
