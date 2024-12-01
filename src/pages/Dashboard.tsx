// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/Dashboard.css';
import api from '../axiosInstance';
import LogoutButton from './Logout';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { color } from "chart.js/helpers";
import { MdBorderColor } from "react-icons/md";


const Dashboard: React.FC = () => {
    //const [budget, setBudget] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    
    const budget = [
        { id: 1, name: "Groceries", amount : 1324, percentage: 25 },
    { id: 2, name: "Entertainment", amount : 12, percentage: 50 },
    { id: 3, name: "Utilities",  amount : 343,percentage: 100 },
    { id: 4, name: "Dining", amount : 255, percentage: 80 },
    {id:5, name:"Travel",  amount : 800,percentage:200},
    {id:6, name:"Housing",  amount : 200,percentage:150}

    ]
    const getColor =(percentage) =>{
        const norm = Math.min(Math.max(percentage/200, 0),1);
        const r = Math.round(norm*255);
        const b = Math.round((1- norm)*255);
        const g= Math.round((1-Math.abs(norm-0.5)*2)*255)
        return `rgb(${r}, ${g}, ${b})`;
    }
    const data = {
        labels: ['January', 'February', 'March', 'April', "May", "June", "July", "August"], 
        datasets:[{
            label:'Expenses', backgroundColor: 'red', borderColor: 'red',
            data:[3450, 1900, 5443, 6455, 2432, 4994, 9009, 2994, 4324, 2324, 4002 ]
        }, 
        {label:'Income', backgroundColor: 'green', borderColor: 'green',
            data:[12300, 10030, 7599,8003, 8045, 9045, 5060, 5883, 10044]
        }
    ]
    }
    const data2 = {
        labels: ['Entertainment', 'Utilities', 'Dining', 'Travel', 'Education', 'Bills', 'Personal'],
        datasets:[{
            label:'Sales', 
            data:[2004, 234, 994, 500, 244, 533], 
            backgroundColor: [
                '#FF6384', // Entertainment
                '#36A2EB', // Utilities
                '#FFCE56', // Dining
                '#4BC0C0', // Travel
                '#FF9F40', // Education
                '#9966FF', // Bills
                '#FF6347'  // Personal
            ]
        }]
    }
    const options = {
        plugins:{
            legend:{
                position: 'bottom', 
                align:'start',
                labels:{
                    boxWidth:15, 
                    padding: 10, 
                    font:{
                        size: 14,
                    }

                }
            }
        },
        datalabels:{
            color: '#fff'

        }
    }
    const option2={
        plugins:{
            legend:{
                position:'top', 
                align: 'end'
            }
        }
    }

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

    const handleUpdateAccountClick = () => {
        navigate('/update-account');
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
                <button onClick={handleUpdateAccountClick} className="btn btn-secondary mt-3">
                    Update Account
                </button>
            <LogoutButton />
            </div>
        </div>
        </div>
    );
};

export default Dashboard;
