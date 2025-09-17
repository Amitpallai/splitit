import express from 'express';
import { signup, login, logout, isAuth } from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, isAuth);

export default router;
