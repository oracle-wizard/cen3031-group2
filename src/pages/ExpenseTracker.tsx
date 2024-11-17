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
  description: string | null;
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

  const [editingId, setEditingId] = useState<number | null>(null); // To track the editing row
  const [editingExpense, setEditingExpense] = useState<Partial<Expense> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchExpenses(); // Fetch expenses when the component loads
    }
  }, [navigate]);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenseTracker', { withCredentials: true });
      setExpenses(response.data.map((item: any) => ({
        expense_id: item[0],
        expense_title: item[1],
        category_name: item[2],
        expense_amount: item[3],
        expense_date: new Date(item[4]).toLocaleDateString(),
        description: item[5] || '-'
      })));
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
      await api.post('/expenses', newExpense, { withCredentials: true });
      setNewExpense({
        expense_title: '',
        category_name: '',
        expense_amount: '',
        expense_date: '',
        description: ''
      });
      await fetchExpenses();
    } catch (error) {
      console.log('Error adding expense:', error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.expense_id);
    setEditingExpense({ ...expense });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingExpense((prev) => {
        if (name === 'expense_date') {
            // Format the date to YYYY-MM-DD
            const formattedDate = new Date(value).toISOString().split('T')[0];
            return { ...prev!, [name]: formattedDate };
        }
        return { ...prev!, [name]: value };
    });
};


  const handleSaveEdit = async () => {
    if (editingExpense) {
      try {
        // Send PUT request to update the expense in the database
        await api.put('/expenses', editingExpense, { withCredentials: true });

        // Update the local state
        const updatedExpenses = expenses.map((expense) =>
          expense.expense_id === editingExpense.expense_id ? { ...expense, ...editingExpense } : expense
        );
        setExpenses(updatedExpenses);
        setEditingId(null);
        setEditingExpense(null);
      } catch (error) {
        console.log('Error updating expense:', error);
      }
    }
  };

  const handleDelete = async (expenseId: number) => {
    try {
      // Send DELETE request to remove the expense from the database
      await api.delete('/expenses', {
        data: { expense_id: expenseId },
        withCredentials: true
      });

      // Update the local state
      setExpenses((prev) => prev.filter((expense) => expense.expense_id !== expenseId));
    } catch (error) {
      console.log('Error deleting expense:', error);
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <tr key={expense.expense_id}>
                {editingId === expense.expense_id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="expense_title"
                        value={editingExpense?.expense_title || ''}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="category_name"
                        value={editingExpense?.category_name || ''}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="expense_amount"
                        value={editingExpense?.expense_amount || ''}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="expense_date"
                        value={editingExpense?.expense_date || ''}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <textarea
                        name="description"
                        value={editingExpense?.description || ''}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{expense.expense_title}</td>
                    <td>{expense.category_name}</td>
                    <td>{expense.expense_amount}</td>
                    <td>{expense.expense_date}</td>
                    <td>{expense.description || '-'}</td>
                    <td>
                      <button onClick={() => handleEdit(expense)}>Edit</button>
                      <button onClick={() => handleDelete(expense.expense_id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No expenses found</td>
            </tr>
          )}
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
