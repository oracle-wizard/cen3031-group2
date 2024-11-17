// ExpenseTracker.tsx
// import { useNavigate } from 'react-router-dom';
// import api from '../axiosInstance';
// import './styles/ExpenseTracker.css';
import React, { useState, useEffect  } from 'react';
import DateInputToday from '../components/DateInputToday';
import RecentTransactionsTable from '../components/RecentTransactionsFakeDate'

interface Expense {
    description: string;
    category: string;
    amount: string;
    payee: string;
    note: string;
    date: string;
    isRecurring: boolean;
  }
  
const ExpenseTracker = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Non-recurring');
  const [amount, setAmount] = useState('');
  const [payee, setPayee] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment'];
  const recurringCategories  = ['Non-recurring', 'Recurring'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newExpense = {
      description,
      category,
      amount,
      payee,
      note,
      date,
      isRecurring,
    };

    setExpenses([...expenses, newExpense]);

    // Reset form fields
    setDescription('');
    setCategory('');
    setAmount('');
    setPayee('');
    setNote('');
    setDate('');
    setIsRecurring(false);
  };

  const handleDelete = (index : number) => {
    const updatedExpenses = expenses.filter((_, idx) => idx !== index);
    setExpenses(updatedExpenses);
  };

  const handleEdit = (index : number) => {
    const expenseToEdit = expenses[index];
    setDescription(expenseToEdit.description);
    setCategory(expenseToEdit.category);
    setAmount(expenseToEdit.amount);
    setPayee(expenseToEdit.payee);
    setNote(expenseToEdit.note);
    setDate(expenseToEdit.date);
    setIsRecurring(expenseToEdit.isRecurring);
    handleDelete(index); // Remove expense from list after editing
  };

  return (
    <div className='text-start'>
        
      <p className='tw-mb-4 tw-text-green-800'>NEW TRANSACTION</p>
      <form onSubmit={handleSubmit}>
        <div className='tw-grid tw-grid-cols-8 tw-grid-rows-2 tw-gap-4'>
            <input
                type="text"
                className='tw-col-span-4 tw-border tw-pl-4'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder='Add a description'
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required   
                className='tw-col-span-2 tw-border tw-pl-4'             
            >
                <option value="">Category</option>
                {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                    {cat}
                </option>
                ))}
            </select>

            <div className='tw-flex'>
            <input
                type="number"
                className='tw-col-span-1 tw-border'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            
            <div className='tw-border-r tw-border-b tw-border-t tw-p-4 tw-self-center'>USD</div>
            </div>

            <input
                type="text"
                className='tw-col-span-2 tw-row-start-2 tw-border tw-pl-4'
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
                placeholder='Payee'
                required
            />
            <textarea
                className='tw-col-span-2 tw-border tw-pl-4 tw-content-center'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder='Notes'
            />
            <DateInputToday/>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required   
                className='tw-col-span-1 tw-border '             
            >
                {recurringCategories.map((cat, idx) => (
                <option key={idx} value={cat}>
                    {cat}
                </option>
                ))}
            </select>
            <button className='tw-col-start-7 tw-bg-green-500 tw-text-white tw-place-self-stretch tw-place-items-end' type="submit">Add Expense</button>
        </div>
      </form>

      <h2 className='tw-mt-16 tw-text-green-800'>RECENT TRANSACTIONS</h2>
      <RecentTransactionsTable/>
      {/* <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            <p>
              <strong>{expense.description}</strong> - {expense.category} - ${expense.amount} - {expense.payee} - {expense.date} - {expense.note} -{' '}
              {expense.isRecurring ? 'Recurring' : 'One-time'}
            </p>
            <button onClick={() => handleEdit(index)}>
              <span role="img" aria-label="edit">✏️</span>
            </button>
            <button onClick={() => handleDelete(index)}>
              <span role="img" aria-label="delete">🗑️</span>
            </button>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default ExpenseTracker;
