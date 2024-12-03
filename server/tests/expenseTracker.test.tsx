import { execute } from '../../server/src/database';
import { Request, Response } from 'express';
import { updateTotalSpend, getExpenses, addExpense, updateExpense, deleteExpense } from '../src/controllers/expenseController';

declare global {
  namespace Express {
      interface Request {
          user?: {
              email: string;
          };
      }
  }
}

// Mock the `execute` function
jest.mock('../../server/src/database', () => ({
    execute: jest.fn(),
}));

describe('Expense Tracker API', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        // Set up mocks for req and res
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock })) as any;

        req = {
            user: { email: 'test@example.com' },
            body: {},
        };
        res = {
            status: statusMock,
            json: jsonMock,
        };
        jest.clearAllMocks(); // Clear mocks between tests
    });

    describe('updateTotalSpend', () => {
        it('should update total spend for a user', async () => {
            (execute as jest.Mock).mockResolvedValue({ rowsAffected: 1 });

            await updateTotalSpend(req as Request, res as Response);

            expect(execute).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'TOTAL_SPENT updated successfully.' });
        });

        it('should return 404 if no rows are updated', async () => {
            (execute as jest.Mock).mockResolvedValue({ rowsAffected: 0 });

            await updateTotalSpend(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'No matching categories or expenses found for the given user.' });
        });

        it('should return 500 on database error', async () => {
            (execute as jest.Mock).mockRejectedValue(new Error('Database error'));

            await updateTotalSpend(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to update TOTAL_SPENT.' });
        });
    });

    describe('getExpenses', () => {
        it('should fetch expenses for a user', async () => {
            const mockRows = [
                { EXPENSE_TITLE: 'Groceries', EXPENSE_AMOUNT: 50 },
                { EXPENSE_TITLE: 'Utilities', EXPENSE_AMOUNT: 75 },
            ];
            (execute as jest.Mock).mockResolvedValue({ rows: mockRows });

            await getExpenses(req as Request, res as Response);

            expect(execute).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockRows);
        });

        it('should return 404 if no expenses are found', async () => {
            (execute as jest.Mock).mockResolvedValue({ rows: null });

            await getExpenses(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'No expenses found for the given user' });
        });

        it('should return 500 on error', async () => {
            (execute as jest.Mock).mockRejectedValue(new Error('Database error'));

            await getExpenses(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to retrieve expenses' });
        });
    });

    describe('addExpense', () => {
        it('should add a new expense', async () => {
            (execute as jest.Mock)
                .mockResolvedValueOnce({ rows: [[1]] }) // Mock category lookup
                .mockResolvedValueOnce({}); // Mock expense insertion

            req.body = {
                expense_title: 'Groceries',
                category_name: 'Food',
                expense_amount: 50.75,
                expense_date: '2024-12-01',
                description: 'Weekly shopping',
            };

            await addExpense(req as Request, res as Response);

            expect(execute).toHaveBeenCalledTimes(2);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Expense added successfully' });
        });

        it('should return 404 if category is not found', async () => {
            (execute as jest.Mock).mockResolvedValue({ rows: [] });

            req.body = {
                category_name: 'InvalidCategory',
            };

            await addExpense(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Category not found for the given user' });
        });

        it('should return 500 on error', async () => {
            (execute as jest.Mock).mockRejectedValue(new Error('Database error'));

            await addExpense(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to add expense' });
        });
    });

    describe('deleteExpense', () => {
        it('should delete an expense', async () => {
            (execute as jest.Mock).mockResolvedValue({ rowsAffected: 1 });

            req.body = { expense_id: 1 };

            await deleteExpense(req as Request, res as Response);

            expect(execute).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Expense deleted successfully' });
        });

        it('should return 500 on error', async () => {
            (execute as jest.Mock).mockRejectedValue(new Error('Database error'));

            await deleteExpense(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to delete expense' });
        });
    });
});
