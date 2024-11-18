import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave } from 'react-icons/fa';
import api from '../axiosInstance';

interface Expense {
  expense_id: number;
  expense_date: string;
  expense_title: string;
  category_name: string;
  note: string;
  description: string;
  expense_amount: number;
  recurring: boolean;
}

const ExpenseTracker: React.FC = () => {
  const [description, setDescription] = useState('');
  const [category_name, setCategory] = useState('Non-recurring');
  const [expense_amount, setAmount] = useState<number>(0);
  const [expense_id, setExpenseID] = useState<number>(0);
  const [expense_title, setPayee] = useState('');
  const [note, setNote] = useState('');
  const [expense_date, setDate] = useState('');
  const [recurring, setIsRecurring] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sortBy, setSortBy] = useState('date'); // Sorting state
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null); // Track the currently edited expense

  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedDate = new Date(expense_date).toISOString().split('T')[0]; // Format to YYYY-MM-DD
    const newExpense = {
      expense_id,
      description,
      category_name,
      expense_amount,
      expense_title,
      note,
      expense_date : formattedDate,
      recurring,
    };

    try {
      await api.post('/add-expenses', newExpense);
      setExpenses((prev) => [...prev, newExpense]); // Update local state
      resetForm();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const resetForm = () => {
    setDescription('');
    setCategory('Non-recurring');
    setAmount(0);
    setExpenseID(0);
    setPayee('');
    setNote('');
    setDate('');
    setIsRecurring(false);
  };

  const fetchExpenses = async (): Promise<void> => {
    try {
      const response = await api.get('/get-expenses');
      const mappedData = response.data.map((expense: any) => {
        const formattedDate = new Date(expense[4]); // Create a Date object
        const formattedExpenseDate = formattedDate.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
      return {
        expense_id: expense[0],
        expense_title: expense[1],
        category_name: expense[2],
        expense_amount: expense[3],
        expense_date: formattedExpenseDate,
        note: expense[5],
        expense_user: expense[6], // Assuming this is part of the response, adjust if needed
        recurring: false, // Assuming recurring is not part of the API data, set default or fetch separately
      };
    });
      setExpenses(mappedData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleDelete = async (expenseId: number) => {
    try {
      await api.delete('/delete-expenses', { data: { expense_id: expenseId } });
      setExpenses((prev) => prev.filter((expense) => expense.expense_id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEdit = (expenseId: number) => {
    setEditingExpenseId(expenseId); // Enable editing mode
  };

  const handleSave = async (expense: Expense) => {
    try {
      await api.put('/update-expenses', expense); 
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.expense_id === expense.expense_id ? { ...exp, ...expense } : exp
        )
      );
      setEditingExpenseId(null); // Exit editing mode
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  
  useEffect(() => {
    fetchExpenses();
  }, []);

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
      <h2 className="tw-text-green-800">New Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="tw-grid tw-grid-cols-8 tw-grid-rows-2 tw-gap-4">
          <input
            type="text"
            className="tw-col-span-4 tw-border tw-pl-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description"
            required
          />
          <select
            value={category_name}
            onChange={(e) => setCategory(e.target.value)}
            className="tw-col-span-2 tw-border tw-pl-4"
          >
            <option value="">Category</option>
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
          <input
            type="text"
            className="tw-col-span-2 tw-border tw-pl-4"
            value={expense_title}
            onChange={(e) => setPayee(e.target.value)}
            placeholder="Payee"
          />
          <textarea
            className="tw-col-span-2 tw-border tw-pl-4"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notes"
          />
          <input
            type="date"
            className="tw-col-span-1 tw-border tw-pl-4"
            value={expense_date}
            onChange={(e) => setDate(e.target.value)}
          />
          <label className="tw-flex items-center tw-col-span-1 tw-border">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
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
              <th>Payee / Category</th>
              <th>Notes</th>
              <th>Amount</th>
              <th>Recurring</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td>{row.expense_date}</td>
                <td>
                  {editingExpenseId === row.expense_id ? (
                    <input
                      type="text"
                      value={row.expense_title}
                      onChange={(e) => {
                        const updatedExpenses = expenses.map((expense) =>
                          expense.expense_id === row.expense_id
                            ? { ...expense, expense_title: e.target.value }
                            : expense
                        );
                        setExpenses(updatedExpenses);
                      }}
                    />
                  ) : (
                    <>
                      {row.expense_title} <br />
                      <span className="tw-text-gray-500">{row.category_name}</span>
                    </>
                  )}
                </td>
                <td>
                  {editingExpenseId === row.expense_id ? (
                    <input
                      type="text"
                      value={row.note}
                      onChange={(e) => {
                        const updatedExpenses = expenses.map((expense) =>
                          expense.expense_id === row.expense_id
                            ? { ...expense, note: e.target.value }
                            : expense
                        );
                        setExpenses(updatedExpenses);
                      }}
                    />
                  ) : (
                    row.note
                  )}
                </td>
                <td>
                  {editingExpenseId === row.expense_id ? (
                    <input
                      type="number"
                      value={row.expense_amount}
                      onChange={(e) => {
                        const updatedExpenses = expenses.map((expense) =>
                          expense.expense_id === row.expense_id
                            ? { ...expense, expense_amount: Number(e.target.value) }
                            : expense
                        );
                        setExpenses(updatedExpenses);
                      }}
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
                      onChange={(e) => {
                        const updatedExpenses = expenses.map((expense) =>
                          expense.expense_id === row.expense_id
                            ? { ...expense, recurring: e.target.checked }
                            : expense
                        );
                        setExpenses(updatedExpenses);
                      }}
                    />
                  ) : (
                    row.recurring ? 'Yes' : 'No'
                  )}
                </td>
                <td>
                  {editingExpenseId === row.expense_id ? (
                    <button onClick={() => handleSave(row)}>
                      <FaSave />
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(row.expense_id)}>
                      <FaEdit />
                    </button>
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(row.expense_id)}>
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


// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrashAlt } from 'react-icons/fa';
// import api from '../axiosInstance';

// interface Expense {
//   expense_id: number
//   expense_date: string;
//   expense_title: string;
//   category_name: string;
//   note: string;
//   description: string;
//   expense_amount: number;
//   recurring: boolean;
// }

// const ExpenseTracker: React.FC = () => {
//   const [description, setDescription] = useState('');
//   const [category_name, setCategory] = useState('Non-recurring');
//   const [expense_amount, setAmount] = useState<number>(0);
//   const [expense_id, setExpenseID] = useState<number>(0);
//   const [expense_title, setPayee] = useState('');
//   const [note, setNote] = useState('');
//   const [expense_date, setDate] = useState('');
//   const [recurring, setIsRecurring] = useState(false);
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [sortBy, setSortBy] = useState('date'); // Sorting state

//   const categories = ['Food', 'Transport', 'Utilities', 'Entertainment'];

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const newExpense = {
//       expense_id,
//       description,
//       category_name,
//       expense_amount,
//       expense_title,
//       note,
//       expense_date,
//       recurring,
//     };

//     try {
//       await api.post('/add-expenses', newExpense);
//       setExpenses((prev) => [...prev, newExpense]); // Update local state
//       resetForm();
//     } catch (error) {
//       console.error('Error adding expense:', error);
//     }
//   };

//   const resetForm = () => {
//     setDescription('');
//     setCategory('Non-recurring');
//     setAmount(0);
//     setExpenseID(0);
//     setPayee('');
//     setNote('');
//     setDate('');
//     setIsRecurring(false);
    
//   };

//   const fetchExpenses = async (): Promise<void> => {
//     try {
//       const response = await api.get('/get-expenses');
//       // Check the response to ensure it's structured correctly
//       const mappedData = response.data.map((expense: any) => ({
//         expense_id: expense[0],
//         expense_title: expense[1],
//         category_name: expense[2],
//         expense_amount: expense[3],
//         expense_date: expense[4],
//         note: expense[5],
//         expense_user: expense[6],  // Assuming this is part of the response, adjust if needed
//         recurring: false, // Assuming recurring is not part of the API data, set default or fetch separately
//       }));
//       setExpenses(mappedData);
//     } catch (error) {
//       console.error('Error fetching expenses:', error);
//     }
//   };

//   const handleDelete = async (expenseId: number) => {
//     try {
//       console.log(expenseId)
//       await api.delete('/delete-expenses', { data: { expense_id: expenseId } });
//       setExpenses((prev) => prev.filter((expense) => expense.expense_id !== expenseId));
//     } catch (error) {
//       console.error('Error deleting expense:', error);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSortBy(e.target.value);
//   };

//   const sortedData = [...expenses].sort((a, b) => {
//     if (sortBy === 'date') {
//       return new Date(a.expense_date).getTime() - new Date(b.expense_date).getTime();
//     } else if (sortBy === 'amount') {
//       return a.expense_amount - b.expense_amount;
//     }
//     return 0;
//   });

//   return (
//     <div className="text-start">
//       <h2 className="tw-text-green-800">New Transaction</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="tw-grid tw-grid-cols-8 tw-gap-4">
//           <input
//             type="text"
//             className="tw-col-span-4 tw-border tw-pl-4"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Add a description"
//             required
//           />
//           <select
//             value={category_name}
//             onChange={(e) => setCategory(e.target.value)}
//             className="tw-col-span-2 tw-border tw-pl-4"
//           >
//             <option value="">Category</option>
//             {categories.map((cat, idx) => (
//               <option key={idx} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//           <input
//             type="number"
//             className="tw-col-span-2 tw-border tw-pl-4"
//             value={expense_amount}
//             onChange={(e) => setAmount(Number(e.target.value))}
//             placeholder="Amount"
//             required
//           />
//           <input
//             type="text"
//             className="tw-col-span-4 tw-border tw-pl-4"
//             value={expense_title}
//             onChange={(e) => setPayee(e.target.value)}
//             placeholder="Payee"
//           />
//           <textarea
//             className="tw-col-span-4 tw-border tw-pl-4"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             placeholder="Notes"
//           />
//           <input
//             type="date"
//             className="tw-col-span-4 tw-border tw-pl-4"
//             value={expense_date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//           <label className="tw-flex items-center tw-col-span-2 tw-border">
//             <input
//               type="checkbox"
//               checked={recurring}
//               onChange={(e) => setIsRecurring(e.target.checked)}
//               className="tw-mr-2"
//             />
//             Recurring
//           </label>
//           <button type="submit" className="tw-col-span-2 tw-bg-green-500 tw-text-white">
//             Add Expense
//           </button>
//         </div>
//       </form>

//       <h2 className="tw-mt-16 tw-text-green-800">Recent Transactions</h2>
//       <div>
//         <div className="tw-mb-4 tw-place-self-end">
//           <label htmlFor="sort" className="tw-mr-2">
//             Sort by:
//           </label>
//           <select
//             id="sort"
//             value={sortBy}
//             onChange={handleSortChange}
//             className="tw-border tw-p-2"
//           >
//             <option value="date">Date</option>
//             <option value="amount">Amount</option>
//           </select>
//         </div>
//         <table className="tw-min-w-full tw-table-auto tw-border-collapse">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Payee / Category</th>
//               <th>Notes</th>
//               <th>Amount</th>
//               <th>Recurring</th>
//               <th>Edit</th>
//               <th>Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedData.map((row, index) => (
//               <tr key={index}>
//                 <td>{row.expense_date}</td>
//                 <td>
//                   {row.expense_title} <br />
//                   <span className="tw-text-gray-500">{row.category_name}</span>
//                 </td>
//                 <td>{row.note}</td>
//                 <td>{row.expense_amount}</td>
//                 <td>
//                   <input type="checkbox" checked={row.recurring} readOnly />
//                 </td>
//                 <td>
//                   <button className="tw-text-blue-500">
//                     <FaEdit />
//                   </button>
//                 </td>
//                 <td>
//                   <button
//                     className="tw-text-red-500"
//                     onClick={() => handleDelete(row.expense_id)}
//                   >
//                     <FaTrashAlt />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ExpenseTracker;