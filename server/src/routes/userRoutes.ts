import { Router } from 'express';
import {register, login, logout, resetPassword, verifyCode} from '../controllers/authController'
import { refreshToken } from '../controllers/refreshTokenController';
import {addBudget} from '../controllers/dashboard'
import authToken from '../middleware/authenticateToken';
const router = Router();
router.post('/register',  register);
router.post('/login',  login);
router.post('/refresh-token',  refreshToken)
router.post('/dashboard', authToken,  addBudget ) ;
router.get('/dashboard', authToken ) ;
router.post('/reset-password', resetPassword)
router.post('/logout', logout)
router.post('/verify-code', verifyCode);
export default router;
