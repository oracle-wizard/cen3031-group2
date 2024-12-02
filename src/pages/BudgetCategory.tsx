import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import '@/styles/BudgetCategory.css';

interface Category {
    name: string; // Corresponds to CATEGORY_NAME
    amount: number; // Corresponds to ALLOCATED_AMOUNT
}

const BudgetCategory: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [newAmount, setNewAmount] = useState<number | ''>('');
    const [editingCategory, setEditingCategory] = useState<{ index: number; name: string } | null>(null); // Tracks the currently edited category
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem("accessToken");
        if (!isAuth) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/get-budget-categories');
            const mappedCategories = response.data.map((item: any) => ({
                name: item[0],
                amount: item[1],
            }));
            setCategories(mappedCategories);
        } catch (error) {
            console.error("Error fetching budget categories:", error.response?.data || error.message);
        }
    };

    const handleAddCategory = async () => {
        if (
            newCategory.trim() !== '' &&
            newAmount !== '' &&
            !categories.some((cat) => cat.name === newCategory)
        ) {
            try {
                const newCategoryData = { category_name: newCategory, allocated_amount: Number(newAmount) };
                await api.post('/add-budget-category', newCategoryData);
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

    const handleEditName = async (index: number, newName: string) => {
        const updatedCategory = categories[index];
        try {
            await api.put('/update-budget-category', {
                category_name: updatedCategory.name,
                allocated_amount: updatedCategory.amount,
                new_category_name: newName,
            });
            const updatedCategories = [...categories];
            updatedCategories[index].name = newName;
            setCategories(updatedCategories);
            setEditingCategory(null); // Reset editing state
        } catch (error) {
            console.error("Error updating budget category name:", error.response?.data || error.message);
            alert("Failed to update category name");
        }
    };

    const startEditing = (index: number, name: string) => {
        setEditingCategory({ index, name }); // Set editing state
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingCategory) {
            setEditingCategory({ ...editingCategory, name: e.target.value }); // Update local state
        }
    };

    const saveNameChange = () => {
        if (editingCategory) {
            handleEditName(editingCategory.index, editingCategory.name);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    return (
        <div className="budget-category-container">
            <div className="budget-category-content">
                <ul className="category-list">
                    {categories.map((category, index) => (
                        <li key={index} className="category-item">
                            <div className="name-container">
                                {editingCategory?.index === index ? (
                                    <input
                                        type="text"
                                        className="edit-name-input"
                                        value={editingCategory.name}
                                        onChange={handleInputChange}
                                        onBlur={saveNameChange} // Save on blur
                                    />
                                ) : (
                                    <span onClick={() => startEditing(index, category.name)}>
                                        {category.name}
                                    </span>
                                )}
                            </div>
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
            </div>
        </div>
    );
};

export default BudgetCategory;
