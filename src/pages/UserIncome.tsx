import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import '@/styles/UserIncome.css';

const UserIncome: React.FC = () => {
    const [income, setIncome] = useState<number | ''>(''); // Stores the raw income value
    const [formattedIncome, setFormattedIncome] = useState<string>(''); // Stores the income with the dollar sign
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem("accessToken");
        if (!isAuth) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchIncome = async () => {
        try {
            const response = await api.get('/get-user-income');
            const { TOTAL_INCOME } = response.data; // Destructure the value from the backend response
            if (TOTAL_INCOME !== undefined) {
                setIncome(TOTAL_INCOME);
                setFormattedIncome(`$${TOTAL_INCOME}`);
            } else {
                setFormattedIncome('$0'); // Default if no income exists
            }
        } catch (error) {
            console.error('Error fetching user income:', error.response?.data || error.message);
            setMessage('Failed to fetch income');
        }
    };
    

    const handleUpdateIncome = async () => {
        if (income === '' || income < 0) {
            setMessage('Please enter a valid income amount');
            return;
        }

        try {
            const response = await api.put('/update-user-income', { total_income: Number(income) });
            if (response.status === 200) {
                setFormattedIncome(`$${income}`); // Update the displayed income
                setMessage('Income updated successfully');
            }
        } catch (error) {
            console.error('Error updating user income:', error.response?.data || error.message);
            setMessage('Failed to update income');
        }
    };

    useEffect(() => {
        fetchIncome();
    }, []);

    return (
        <div className="user-income-container">
            <h1>User Income</h1>
            <div className="income-display">
                <label>Current Income:</label>
                <span className="current-income">{formattedIncome || '$0'}</span>
            </div>
            <div className="income-input-container">
                <label htmlFor="income">Update Income:</label>
                <input
                    type="number"
                    id="income"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                />
                <button onClick={handleUpdateIncome} className="update-button">
                    Update Income
                </button>
            </div>
            {message && <div className="message">{message}</div>}
            <button onClick={() => navigate('/dashboard')} className="back-button">
                Back to Dashboard
            </button>
        </div>
    );
};

export default UserIncome;
