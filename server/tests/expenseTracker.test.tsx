import request from 'supertest';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../src/controllers/expenseController';
import { execute } from '../../server/src/database';
import express, { Request, Response } from 'express';

jest.mock('../database'); // Mock the execute function
const mockedExecute = execute as jest.Mock;

const app = express();
app.use(express.json()); // To parse JSON requests
app.post('/get-expenses', getExpenses);
app.post('/add-expense', addExpense);
app.put('/update-expense', updateExpense);
app.delete('/delete-expense', deleteExpense);

describe('Expense Routes', () => {
  const mockUser = { email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('GET /get-expenses', () => {
    it('should return expenses for the logged-in user', async () => {
      // Mock the execute function to return test data
      mockedExecute.mockResolvedValueOnce({
        rows: [
          {
            EXPENSE_ID: 1,
            EXPENSE_TITLE: 'Groceries',
            CATEGORY_NAME: 'Food',
            EXPENSE_AMOUNT: 50,
            EXPENSE_DATE: '2024-11-01',
            DESCRIPTION: 'Weekly groceries',
            EMAIL: 'test@example.com',
          },
        ],
      });

      const response = await request(app)
        .post('/get-expenses')
        .set('Authorization', 'Bearer fake-token') // Simulate auth (if needed)
        .send()
        .expect(200);

      expect(mockedExecute).toHaveBeenCalledWith(
        expect.any(String),
        { EMAIL: mockUser.email }
      );
      expect(response.body).toEqual([
        {
          EXPENSE_ID: 1,
          EXPENSE_TITLE: 'Groceries',
          CATEGORY_NAME: 'Food',
          EXPENSE_AMOUNT: 50,
          EXPENSE_DATE: '2024-11-01',
          DESCRIPTION: 'Weekly groceries',
          EMAIL: 'test@example.com',
        },
      ]);
    });

    it('should return a 500 error if fetching expenses fails', async () => {
      mockedExecute.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).post('/get-expenses').send().expect(500);

      expect(mockedExecute).toHaveBeenCalled();
      expect(response.body).toEqual({ error: 'Failed to retrieve expenses' });
    });
  });

  describe('POST /add-expense', () => {
    it('should add a new expense and return success', async () => {
      mockedExecute.mockResolvedValueOnce({});

      const expenseData = {
        expense_title: 'Rent',
        category_name: 'Housing',
        expense_amount: 1000,
        expense_date: '2024-11-01',
        description: 'Monthly rent',
      };

      const response = await request(app).post('/add-expense').send(expenseData).expect(200);

      expect(mockedExecute).toHaveBeenCalledWith(
        expect.any(String),
        {
          EXPENSE_TITLE: 'Rent',
          CATEGORY_NAME: 'Housing',
          EXPENSE_AMOUNT: 1000,
          EXPENSE_DATE: '2024-11-01',
          DESCRIPTION: 'Monthly rent',
          EMAIL: undefined, // Replace with mockUser.email if user email is available in middleware
        }
      );
      expect(response.body).toEqual({ message: 'Expense added successfully' });
    });

    it('should return a 500 error if adding expense fails', async () => {
      mockedExecute.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/add-expense')
        .send({
          expense_title: 'Rent',
          category_name: 'Housing',
          expense_amount: 1000,
          expense_date: '2024-11-01',
        })
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to add expense' });
    });
  });

  describe('PUT /update-expense', () => {
    it('should update an expense and return success', async () => {
      mockedExecute.mockResolvedValueOnce({});

      const expenseData = {
        expense_id: 1,
        expense_title: 'Groceries',
        category_name: 'Food',
        expense_amount: 60,
        expense_date: '2024-11-02',
        description: 'Weekly groceries (updated)',
      };

      const response = await request(app).put('/update-expense').send(expenseData).expect(200);

      expect(mockedExecute).toHaveBeenCalledWith(
        expect.any(String),
        {
          EXPENSE_ID: 1,
          EXPENSE_TITLE: 'Groceries',
          CATEGORY_NAME: 'Food',
          EXPENSE_AMOUNT: 60,
          EXPENSE_DATE: '2024-11-02',
          DESCRIPTION: 'Weekly groceries (updated)',
        }
      );
      expect(response.body).toEqual({ message: 'Expense updated successfully' });
    });
  });

  describe('DELETE /delete-expense', () => {
    it('should delete an expense and return success', async () => {
      mockedExecute.mockResolvedValueOnce({});

      const expenseData = { expense_id: 1 };

      const response = await request(app).delete('/delete-expense').send(expenseData).expect(200);

      expect(mockedExecute).toHaveBeenCalledWith(expect.any(String), { EXPENSE_ID: 1 });
      expect(response.body).toEqual({ message: 'Expense deleted successfully' });
    });

    it('should return a 500 error if deleting an expense fails', async () => {
      mockedExecute.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).delete('/delete-expense').send({ expense_id: 1 }).expect(500);

      expect(response.body).toEqual({ error: 'Failed to delete expense' });
    });
  });
});
