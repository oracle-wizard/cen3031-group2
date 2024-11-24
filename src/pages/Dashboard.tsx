// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/Dashboard.css';
import api from '../axiosInstance';
import LogoutButton from './Logout';

const Dashboard: React.FC = () => {
    const [budget, setBudget] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem("accessToken");
        if (!isAuth) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBudget(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (budget) {
            try {
                const response = await api.post('/dashboard', 
                    { budget: budget }, 
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    setMessage(`Your budget is set to $${budget}`);
                }
            } catch (err) {
                console.log(`An error occurred in handleSubmit: ${err}`);
            }
        } else {
            setMessage('Please enter a valid budget');
        }
    };

    const handleExpenseTrackerClick = () => {
        navigate('/expense-tracker');
    };

    const handleEditBudgetClick = () => {
        navigate('/budget-category');
    };

    const handleUserIncomeClick = () => {
        navigate('/user-income'); // Navigate to the UserIncome page
    };

    return (
        <div className="tw-flex">
            <div className='tw-col'>
            <h2>Dashboard</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="budget">Set your budget:</label>
                    <input 
                        type="text"
                        id="budget"
                        className="form-control"
                        value={budget}
                        onChange={handleChange}
                        placeholder="Enter your budget"
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button>
            </form>
            {message && <div className='alert alert-info mt-3'>{message}</div>}
            <div className=''>
                <button onClick={handleExpenseTrackerClick} className="btn btn-secondary mt-3">
                    Expense Tracker
                </button>
                <button onClick={handleEditBudgetClick} className="btn btn-secondary mt-3">
                    Edit Budget
                </button>
                <button onClick={handleUserIncomeClick} className="btn btn-secondary mt-3">
                User Income
            </button>
            <LogoutButton />
            </div>
        </div>
        </div>
    );
};

export default Dashboard;
