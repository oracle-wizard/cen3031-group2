import { Router } from 'express';
import {register, login, logout, resetPassword, verifyCode} from '../controllers/authController'
import { refreshToken } from '../controllers/refreshTokenController';
import {addBudget} from '../controllers/dashboard'
import authToken from '../middleware/authenticateToken';
import { getExpenses } from '../controllers/expenseController';
//TODO import { getExpenses, addExpense } from '../controllers/expenseController';
const router = Router();
router.post('/register',  register);
router.post('/login',  login);
router.post('/refresh-token',  refreshToken)
router.post('/dashboard', authToken,  addBudget ) ;
router.get('/dashboard', authToken ) ;
router.get('/expenseTracker', authToken, getExpenses);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.post('/verify-code', verifyCode);
//router.get('/expenses', getExpenses);
//router.post('/expenses', addExpense);
export default router;
