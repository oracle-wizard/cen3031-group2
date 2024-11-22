import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import '@/styles/BudgetCategory.css';

interface Category {
    name: string; // Corresponds to CATEGORY_NAME
    amount: number; // Corresponds to ALLOCATED_AMOUNT
}

const BudgetCategory: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]); // State for categories
    const [newCategory, setNewCategory] = useState(''); // State for new category name
    const [newAmount, setNewAmount] = useState<number | ''>(''); // State for new category amount
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem("accessToken");
        if (!isAuth) {
            navigate('/login');
        }
    }, [navigate]);

    // Fetch budget categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await api.get('/get-budget-categories');
            const mappedCategories = response.data.map((item: any) => ({
                name: item[0], // First element is the category name
                amount: item[1], // Second element is the allocated amount
            }));
            setCategories(mappedCategories); // Update state
        } catch (error) {
            console.error("Error fetching budget categories:", error.response?.data || error.message);
        }
    };

    // Add a new category
    const handleAddCategory = async () => {
        if (
            newCategory.trim() !== '' &&
            newAmount !== '' &&
            !categories.some((cat) => cat.name === newCategory)
        ) {
            try {
                const newCategoryData = { category_name: newCategory, allocated_amount: Number(newAmount) };
                await api.post('/add-budget-category', newCategoryData); // Send to backend
                setCategories([
                    ...categories,
                    { name: newCategory, amount: Number(newAmount) },
                ]);
                setNewCategory('');
                setNewAmount('');
            } catch (error) {
                console.error("Error adding budget category:", error.response?.data || error.message);
                alert("Failed to add category");
            }
        } else {
            alert('Please enter a valid and unique category name and a valid amount.');
        }
    };

    // Delete a category
    const handleDeleteCategory = async (categoryName: string) => {
        try {
            await api.delete('/delete-budget-category', {
                data: { category_name: categoryName },
            });
            setCategories(categories.filter((cat) => cat.name !== categoryName));
        } catch (error) {
            console.error("Error deleting budget category:", error.response?.data || error.message);
            alert("Failed to delete category");
        }
    };

    // Edit a category amount
    const handleEditAmount = async (index: number, newAmount: number) => {
        const updatedCategory = categories[index];
        try {
            await api.put('/update-budget-category', {
                category_name: updatedCategory.name,
                allocated_amount: newAmount,
            });
            const updatedCategories = [...categories];
            updatedCategories[index].amount = newAmount;
            setCategories(updatedCategories);
        } catch (error) {
            console.error("Error updating budget category:", error.response?.data || error.message);
            alert("Failed to update category amount");
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="budget-category-container">
            <div className="budget-category-content">
                <h1 className="budget-category-title">Budget Categories</h1>
                <ul className="category-list">
                    {categories.map((category, index) => (
                        <li key={index} className="category-item">
                            <span>{category.name}:</span>
                            <div className="amount-container">
                                <span className="dollar-sign">$</span>
                                <input
                                    type="number"
                                    className="edit-amount-input"
                                    value={category.amount}
                                    onChange={(e) =>
                                        handleEditAmount(index, Number(e.target.value))
                                    }
                                />
                            </div>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteCategory(category.name)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="add-category-form">
                    <input
                        type="text"
                        placeholder="New category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="category-input"
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newAmount}
                        onChange={(e) =>
                            setNewAmount(e.target.value ? Number(e.target.value) : '')
                        }
                        className="amount-input"
                    />
                    <button onClick={handleAddCategory} className="add-button">
                        Add Category
                    </button>
                </div>
                <div className="navigation-buttons">
                    <button onClick={() => navigate('/dashboard')} className="back-button">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BudgetCategory;
