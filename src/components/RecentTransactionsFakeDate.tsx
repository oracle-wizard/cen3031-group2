import React from 'react';
import TableWithSorting from './RecentTransactions';  // Adjust path as needed

interface TableRow {
    date: string;
    payee: string;
    category: string;
    notes: string;
    amount: number;
    recurring: boolean;
}

const RecentTransactionsTable: React.FC = () => {
    const data: TableRow[] = [
        {
            date: '2024-11-01',
            payee: 'Walmart',
            category: 'Groceries',
            notes: 'Thanksgiving',
            amount: 100,
            recurring: true
        },
        {
            date: '2024-11-02',
            payee: 'Programming',
            category: 'Royalites',
            notes: 'Gaming royalites',
            amount: 5000,
            recurring: false
        },
        {
            date: '2024-11-03',
            payee: 'Amazon',
            category: 'Entertainment',
            notes: 'Prime subscription',
            amount: 12.99,
            recurring: true
        }
    ];

    return (
        <div className="p-6">
            <TableWithSorting data={data} />
        </div>
    );
};

export default RecentTransactionsTable;
