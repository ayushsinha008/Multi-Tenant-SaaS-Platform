import { Router } from 'express';
import { generateHash, paymentSuccess, paymentFailure } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/payu/hash', authenticate, generateHash);
// Callbacks from PayU don't have our JWT, so we don't use requireAuth
router.post('/payu/success', paymentSuccess);
router.post('/payu/failure', paymentFailure);

export default router;
