// ExpenseTracker.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import './styles/ExpenseTracker.css';

interface Expense {
    expense_id: number;
    expense_title: string;
    category_name: string;
    expense_amount: number;
    expense_date: string;
    description: string;
}

const ExpenseTracker: React.FC = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [newExpense, setNewExpense] = useState({
        expense_title: '',
        category_name: '',
        expense_amount: '',
        expense_date: '',
        description: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            fetchExpenses();
        }
    }, [navigate]);

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/expenses', { withCredentials: true });
            setExpenses(response.data);
        } catch (error) {
            console.log('Error fetching expenses:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewExpense((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/expenses', newExpense, { withCredentials: true });
            if (response.status === 200) {
                setExpenses([...expenses, response.data]);
                setNewExpense({ expense_title: '', category_name: '', expense_amount: '', expense_date: '', description: '' });
            }
        } catch (error) {
            console.log('Error adding expense:', error);
        }
    };

    return (
        <div className="expense-tracker-container">
            <h2>Expense Tracker</h2>

            {/* Displaying Expenses */}
            <table className="expense-table">
                <thead>
                    <tr>
                        <th>Expense Title</th>
                        <th>Category</th>
                        <th>Amount ($)</th>
                        <th>Date</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.expense_id}>
                            <td>{expense.expense_title}</td>
                            <td>{expense.category_name}</td>
                            <td>{expense.expense_amount}</td>
                            <td>{expense.expense_date}</td>
                            <td>{expense.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Form for New Expense */}
            <div className="new-expense-form">
                <h3>Add New Expense</h3>
                <form onSubmit={handleAddExpense}>
                    <input
                        type="text"
                        name="expense_title"
                        value={newExpense.expense_title}
                        onChange={handleInputChange}
                        placeholder="Expense Title"
                        required
                    />
                    <input
                        type="text"
                        name="category_name"
                        value={newExpense.category_name}
                        onChange={handleInputChange}
                        placeholder="Category"
                        required
                    />
                    <input
                        type="number"
                        name="expense_amount"
                        value={newExpense.expense_amount}
                        onChange={handleInputChange}
                        placeholder="Amount"
                        required
                    />
                    <input
                        type="date"
                        name="expense_date"
                        value={newExpense.expense_date}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="description"
                        value={newExpense.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                    />
                    <button type="submit">Add Expense</button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseTracker;
