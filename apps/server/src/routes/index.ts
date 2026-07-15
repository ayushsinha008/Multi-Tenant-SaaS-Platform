import { Router } from 'express';
import authRoutes from './authRoutes';
import organizationRoutes from './organizationRoutes';
import projectRoutes from './projectRoutes';
import taskRoutes from './taskRoutes';
import memberRoutes from './memberRoutes';
import fileRoutes from './fileRoutes';
import notificationRoutes from './notificationRoutes';
import activityRoutes from './activityRoutes';
import analyticsRoutes from './analyticsRoutes';
import commentRoutes from './commentRoutes';
import searchRoutes from './searchRoutes';
import paymentRoutes from './paymentRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/organizations', organizationRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/members', memberRoutes);
router.use('/files', fileRoutes);
router.use('/notifications', notificationRoutes);
router.use('/activity', activityRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/comments', commentRoutes);
router.use('/search', searchRoutes);
router.use('/payment', paymentRoutes);

export default router;
