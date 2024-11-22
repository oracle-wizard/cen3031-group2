import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave } from 'react-icons/fa';
import api from '../axiosInstance';
import '@/styles/BudgetCategory.css';

const BudgetCategory: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1>Hello, World!</h1>
        </div>
    );
};

export default BudgetCategory;