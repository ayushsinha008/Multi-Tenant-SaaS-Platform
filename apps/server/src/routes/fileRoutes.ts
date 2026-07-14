import { Router } from 'express';
import multer from 'multer';
import { uploadFile, deleteFile, getFiles } from '../controllers/fileController';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.use(authenticate, requireTenant);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.delete('/:id', deleteFile);

export default router;
