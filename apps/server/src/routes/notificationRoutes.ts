import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';

const router = Router();

router.use(authenticate, requireTenant);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
