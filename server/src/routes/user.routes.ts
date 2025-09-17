import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);

export default router;
