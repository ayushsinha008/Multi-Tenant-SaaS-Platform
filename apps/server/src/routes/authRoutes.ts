import { Router } from 'express';
import { register, login, logout, refreshToken, getProfile, updateProfile, googleLogin, updatePreferences, getPendingInvitations, acceptGlobalInvitation, rejectGlobalInvitation } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);
router.patch('/preferences', authenticate, updatePreferences);

// Invitations
router.get('/me/invitations', authenticate, getPendingInvitations);
router.post('/me/invitations/:id/accept', authenticate, acceptGlobalInvitation);
router.post('/me/invitations/:id/reject', authenticate, rejectGlobalInvitation);

export default router;
