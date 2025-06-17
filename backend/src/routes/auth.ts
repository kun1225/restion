import { Router } from 'express';
import {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
  logoutAllController,
  getMeController,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshTokenController);

// Protected routes
router.post('/logout', authenticateToken, logoutController);
router.post('/logout-all', authenticateToken, logoutAllController);
router.get('/me', authenticateToken, getMeController);

export default router;
