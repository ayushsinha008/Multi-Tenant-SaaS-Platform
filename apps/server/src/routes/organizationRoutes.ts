import { Router } from 'express';
import { createOrganization, getOrganizations, getOrganizationById, updateOrganization, deleteOrganization } from '../controllers/organizationController';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';
import { requireRole } from '../middleware/role';
import { Role } from '../models/Member';

const router = Router();

// Routes that don't need tenant context
router.post('/', authenticate, createOrganization);
router.get('/', authenticate, getOrganizations);

// Routes that need tenant context
router.use('/:id', authenticate, (req, res, next) => {
  // Map the route parameter 'id' to 'x-tenant-id' header for the middleware
  req.headers['x-tenant-id'] = req.params.id;
  next();
}, requireTenant);

router.get('/:id', getOrganizationById);
router.patch('/:id', requireRole([Role.ADMIN]), updateOrganization);
router.delete('/:id', requireRole([Role.ADMIN]), deleteOrganization);

export default router;
