import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // for pencil and trashcan icons

interface TableRow {
    date: string;
    payee: string;
    category: string;
    notes: string;
    amount: number;
    recurring: boolean;
}

interface TableWithSortingProps {
    data: TableRow[];
}

const TableWithSorting: React.FC<TableWithSortingProps> = ({ data }) => {
    const [sortBy, setSortBy] = useState('date'); // default sorting by date

    // Function to handle sorting
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const sortedData = [...data].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'amount') {
            return a.amount - b.amount;
        }
        return 0;
    });

    return (
        <div>
            <div className="tw-mb-4 tw-place-self-end">
                <label htmlFor="sort" className="tw-mr-2">Sort by:</label>
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
                        <th className="tw-border-b tw-px-4 tw-py-2 tw-text-left">Date</th>
                        <th className="tw-border-b tw-px-4 tw-py-2 tw-text-left">Payee / Category</th>
                        <th className="tw-border-b tw-px-4 tw-py-2 tw-text-left">Notes</th>
                        <th className="tw-border-b tw-px-4 tw-py-2 tw-text-left">Amount</th>
                        <th className="tw-border-b tw-px-4 tw-py-2 tw-text-left">Recurring</th>
                        <th className="tw-border-b tw-px-4 tw-py-2 tw-text-left">Edit</th>
                        <th className="tw-border-b tw-px-4 tw-py-2 tw-text-left">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, index) => (
                        <tr key={index}>
                            <td className="tw-border-b tw-px-4 tw-py-2">{row.date}</td>
                            <td className="tw-border-b tw-px-4 tw-py-2">
                                <div>{row.payee}</div>
                                <div className="text-gray-500">{row.category}</div>
                            </td>
                            <td className="tw-border-b tw-px-4 tw-py-2">{row.notes}</td>
                            <td className="tw-border-b tw-px-4 tw-py-2">{row.amount}</td>
                            <td className="tw-border-b tw-px-4 tw-py-2">
                                <input 
                                    type="checkbox" 
                                    checked={row.recurring} 
                                    readOnly 
                                    className="cursor-pointer"
                                />
                            </td>
                            <td className="tw-border-b tw-px-4 tw-py-2">
                                <button className="tw-text-blue-500 tw-hover:text-blue-700">
                                    <FaEdit />
                                </button>
                            </td>
                            <td className="tw-border-b tw-px-4 tw-py-2">
                                <button className="tw-text-red-500 tw-hover:text-red-700">
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableWithSorting;
