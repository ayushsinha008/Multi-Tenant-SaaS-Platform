import { Router } from 'express';
import { register, login, logout, refreshToken, getProfile, updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);

export default router;
