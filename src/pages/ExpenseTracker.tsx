import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../axiosInstance';

interface Expense {
    expense_id: number;
    expense_date: string;
    expense_title: string;
    category_name: string;
    description: string;
    expense_amount: number;
    recurring: boolean;
}

const ExpenseTracker: React.FC = () => {
    const [expense_title, setTitle] = useState('');
    const [category_name, setCategory] = useState('');
    const [expense_amount, setAmount] = useState<number>(0);
    const [expense_date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [recurring, setRecurring] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('date');
    const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchExpenses();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/get-budget-categories');
            const mappedCategories = response.data.map((item: any) => item[0]);
            setCategories(mappedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/get-expenses');
            const mappedData = response.data.map((expense: any) => ({
                expense_id: expense[0],
                expense_title: expense[1],
                category_name: expense[2],
                expense_amount: expense[3],
                expense_date: formatDate(expense[4]),
                description: expense[5],
                recurring: expense[6] || false,
            }));
            setExpenses(mappedData);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formattedDate = new Date(expense_date).toISOString().split('T')[0];

        const newExpense = {
            expense_title,
            category_name,
            expense_amount,
            expense_date: formattedDate,
            description,
            recurring,
        };

        try {
            await api.post('/add-expenses', newExpense);
            fetchExpenses(); // Refresh the expenses list
            resetForm();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const resetForm = () => {
        setTitle('');
        setCategory('');
        setAmount(0);
        setDate('');
        setDescription('');
        setRecurring(false);
    };

    const handleEdit = (expenseId: number) => {
        setEditingExpenseId(expenseId);
    };

    const handleSave = async (expense: Expense) => {
        try {
            await api.put('/update-expenses', expense);
            setEditingExpenseId(null); // Exit editing mode
            fetchExpenses(); // Refresh the table
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    };

    const handleDelete = async (expenseId: number) => {
        try {
            await api.delete('/delete-expenses', { data: { expense_id: expenseId } });
            fetchExpenses(); // Refresh the expenses list
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const sortedData = [...expenses].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(a.expense_date).getTime() - new Date(b.expense_date).getTime();
        } else if (sortBy === 'amount') {
            return a.expense_amount - b.expense_amount;
        }
        return 0;
    });

    return (
        <div className="text-start">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                <h2 className="tw-text-green-800">Expense Tracker</h2>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="tw-bg-blue-500 tw-text-white tw-py-2 tw-px-4 tw-rounded tw-transition hover:tw-bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="tw-grid tw-grid-cols-8 tw-gap-4">
                    <input
                        type="text"
                        className="tw-col-span-2 tw-border tw-pl-4"
                        value={expense_title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Expense Title"
                        required
                    />
                    <select
                        value={category_name}
                        onChange={(e) => setCategory(e.target.value)}
                        className="tw-col-span-2 tw-border tw-pl-4"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        className="tw-col-span-1 tw-border tw-pl-4"
                        value={expense_amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="Amount"
                        required
                    />
                    <textarea
                        className="tw-col-span-2 tw-border tw-pl-4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        required
                    />
                    <input
                        type="date"
                        className="tw-col-span-2 tw-border tw-pl-4"
                        value={expense_date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <label className="tw-flex items-center tw-col-span-1 tw-border">
                        <input
                            type="checkbox"
                            checked={recurring}
                            onChange={(e) => setRecurring(e.target.checked)}
                            className="tw-mr-2"
                        />
                        Recurring
                    </label>
                    <button type="submit" className="tw-col-span-1 tw-bg-green-500 tw-text-white">
                        Add Expense
                    </button>
                </div>
            </form>

            <h2 className="tw-mt-16 tw-text-green-800">Recent Transactions</h2>
            <div>
                <div className="tw-mb-4 tw-place-self-end">
                    <label htmlFor="sort" className="tw-mr-2">
                        Sort by:
                    </label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={handleSortChange}
                        className="tw-border tw-p-2"
                    >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                    </select>
                </div>
                <table className="tw-min-w-full tw-table-auto tw-border-collapse">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Expense Title</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Recurring</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row) => (
                            <tr key={row.expense_id}>
                                <td>
                                    {editingExpenseId === row.expense_id ? (
                                        <input
                                            type="date"
                                            value={row.expense_date}
                                            onChange={(e) =>
                                                setExpenses((prev) =>
                                                    prev.map((exp) =>
                                                        exp.expense_id === row.expense_id
                                                            ? { ...exp, expense_date: e.target.value }
                                                            : exp
                                                    )
                                                )
                                            }
                                        />
                                    ) : (
                                        row.expense_date
                                    )}
                                </td>
                                <td>
                                    {editingExpenseId === row.expense_id ? (
                                        <input
                                            type="text"
                                            value={row.expense_title}
                                            onChange={(e) =>
                                                setExpenses((prev) =>
                                                    prev.map((exp) =>
                                                        exp.expense_id === row.expense_id
                                                            ? { ...exp, expense_title: e.target.value }
                                                            : exp
                                                    )
                                                )
                                            }
                                        />
                                    ) : (
                                        row.expense_title
                                    )}
                                </td>
                                <td>
                                    {editingExpenseId === row.expense_id ? (
                                        <select
                                            value={row.category_name}
                                            onChange={(e) =>
                                                setExpenses((prev) =>
                                                    prev.map((exp) =>
                                                        exp.expense_id === row.expense_id
                                                            ? { ...exp, category_name: e.target.value }
                                                            : exp
                                                    )
                                                )
                                            }
                                        >
                                            {categories.map((cat, idx) => (
                                                <option key={idx} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        row.category_name
                                    )}
                                </td>
                                <td>
                                    {editingExpenseId === row.expense_id ? (
                                        <input
                                            type="text"
                                            value={row.description}
                                            onChange={(e) =>
                                                setExpenses((prev) =>
                                                    prev.map((exp) =>
                                                        exp.expense_id === row.expense_id
                                                            ? { ...exp, description: e.target.value }
                                                            : exp
                                                    )
                                                )
                                            }
                                        />
                                    ) : (
                                        row.description
                                    )}
                                </td>
                                <td>
                                    {editingExpenseId === row.expense_id ? (
                                        <input
                                            type="number"
                                            value={row.expense_amount}
                                            onChange={(e) =>
                                                setExpenses((prev) =>
                                                    prev.map((exp) =>
                                                        exp.expense_id === row.expense_id
                                                            ? { ...exp, expense_amount: Number(e.target.value) }
                                                            : exp
                                                    )
                                                )
                                            }
                                        />
                                    ) : (
                                        row.expense_amount
                                    )}
                                </td>
                                <td>
                                    {editingExpenseId === row.expense_id ? (
                                        <input
                                            type="checkbox"
                                            checked={row.recurring}
                                            onChange={(e) =>
                                                setExpenses((prev) =>
                                                    prev.map((exp) =>
                                                        exp.expense_id === row.expense_id
                                                            ? { ...exp, recurring: e.target.checked }
                                                            : exp
                                                    )
                                                )
                                            }
                                        />
                                    ) : (
                                        row.recurring ? 'Yes' : 'No'
                                    )}
                                </td>
                                <td>
                                    {editingExpenseId === row.expense_id ? (
                                        <button
                                            onClick={() =>
                                                handleSave(
                                                    expenses.find((exp) => exp.expense_id === row.expense_id) as Expense
                                                )
                                            }
                                            className="tw-text-green-500"
                                        >
                                            <FaSave />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(row.expense_id)}
                                            className="tw-text-blue-500"
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(row.expense_id)}
                                        className="tw-text-red-500"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseTracker;
