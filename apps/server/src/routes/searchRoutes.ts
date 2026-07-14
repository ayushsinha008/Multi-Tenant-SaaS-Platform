import { Router } from 'express';
import { globalSearch } from '../controllers/searchController';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';

const router = Router();

router.use(authenticate, requireTenant);

router.get('/global', globalSearch);

export default router;
