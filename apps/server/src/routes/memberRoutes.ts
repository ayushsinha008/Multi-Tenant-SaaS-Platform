import { Router } from 'express';
import { inviteMember, getMembers, updateMemberRole, removeMember, acceptInvitation } from '../controllers/memberController';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';
import { requireRole } from '../middleware/role';
import { Role } from '../models/Member';

const router = Router();

router.use(authenticate, requireTenant);

router.post('/invite', requireRole([Role.ADMIN]), inviteMember);
router.get('/', getMembers);
router.patch('/:id/role', requireRole([Role.ADMIN]), updateMemberRole);
router.delete('/:id', requireRole([Role.ADMIN]), removeMember);
router.post('/:id/accept', acceptInvitation);

export default router;
