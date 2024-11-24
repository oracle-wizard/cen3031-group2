import { Router } from 'express';
import {register, login, logout, resetPassword, verifyCode, deleteUser, setNewPassword} from '../controllers/authController'
import { refreshToken } from '../controllers/refreshTokenController';
import {addBudget} from '../controllers/dashboard'
import authToken from '../middleware/authenticateToken';
import { getExpenses, addExpense, updateExpense, deleteExpense, updateTotalSpend } from '../controllers/expenseController';
import { getUserIncome, updateUserIncome } from '../controllers/userIncomeController';
import {
    getBudgetCategories,
    addBudgetCategory,
    updateBudgetCategory,
    deleteBudgetCategory,
} from '../controllers/budgetController'


const router = Router();
router.post('/register', register);
router.post('/login',  login);
router.post('/refresh-token',  refreshToken)
router.post('/dashboard', authToken,  addBudget ) ;
router.get('/dashboard', authToken ) ;
router.get('/get-expenses', authToken, getExpenses);
router.post('/add-expenses', authToken, addExpense);
router.put('/update-expenses', authToken, updateExpense);
router.delete('/delete-expenses', authToken, deleteExpense);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.post('/verify-code', verifyCode);
router.delete('/delete', deleteUser);
router.post('/new-password', setNewPassword)
router.get('/get-budget-categories', authToken, getBudgetCategories);
router.post('/add-budget-category', authToken, addBudgetCategory);
router.put('/update-budget-category', authToken, updateBudgetCategory);
router.delete('/delete-budget-category', authToken, deleteBudgetCategory);
router.put('/update-total-spend', authToken, updateTotalSpend);
router.get('/get-user-income', authToken, getUserIncome);
router.put('/update-user-income', authToken, updateUserIncome);
export default router;
