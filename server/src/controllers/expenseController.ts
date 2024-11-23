import { Request, Response } from 'express';
import { execute } from '../database';

// Define types for query results
interface CategoryRow {
    CATEGORY_ID: number;
}

interface ExpenseRow {
    EXPENSE_ID: number;
    EXPENSE_TITLE: string;
    CATEGORY_NAME: string;
    EXPENSE_AMOUNT: number;
    EXPENSE_DATE: Date;
    DESCRIPTION: string | null;
    EMAIL: string;
}

// Fetch all expenses for the logged-in user
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail) {
            throw new Error("User email not found in request");
        }

        const query = `
            SELECT 
                e."EXPENSE_ID", 
                e."EXPENSE_TITLE", 
                b."CATEGORY_NAME",
                e."EXPENSE_AMOUNT", 
                e."EXPENSE_DATE", 
                e."DESCRIPTION",
                e."EMAIL"
            FROM "C.SMELTZER"."EXPENSE" e
            JOIN "C.SMELTZER"."BUDGETCATEGORY" b
            ON e."CATEGORY_ID" = b."CATEGORY_ID"
            WHERE LOWER(e."EMAIL") = LOWER(:EMAIL)
        `;
        const binds = { EMAIL: userEmail };

        const result = await execute(query, binds);

        if (!result.rows) {
            res.status(404).json({ error: 'No expenses found for the given user' });
            return;
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to retrieve expenses' });
    }
};

// Add a new expense
export const addExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const userEmail = req.user?.email;
        const { expense_title, category_name, expense_amount, expense_date, description } = req.body;

        const categoryQuery = `
            SELECT "CATEGORY_ID" 
            FROM "C.SMELTZER"."BUDGETCATEGORY"
            WHERE LOWER("CATEGORY_NAME") = LOWER(:CATEGORY_NAME)
              AND LOWER("EMAIL") = LOWER(:EMAIL)
        `;
        const categoryBinds = {
            CATEGORY_NAME: category_name,
            EMAIL: userEmail,
        };

        const categoryResult = await execute(categoryQuery, categoryBinds);

        if (!categoryResult.rows || categoryResult.rows.length === 0) {
            res.status(404).json({ error: 'Category not found for the given user' });
            return;
        }

        const categoryId = categoryResult.rows[0][0]; // Access CATEGORY_ID directly from the first row

        const query = `
            INSERT INTO "C.SMELTZER"."EXPENSE" (
                "EXPENSE_TITLE", 
                "CATEGORY_ID", 
                "EXPENSE_AMOUNT", 
                "EXPENSE_DATE", 
                "DESCRIPTION", 
                "EMAIL"
            ) VALUES (
                :EXPENSE_TITLE, 
                :CATEGORY_ID, 
                :EXPENSE_AMOUNT, 
                TO_DATE(:EXPENSE_DATE, 'YYYY-MM-DD'), 
                :DESCRIPTION, 
                :EMAIL
            )
        `;
        const binds = {
            EXPENSE_TITLE: expense_title,
            CATEGORY_ID: categoryId,
            EXPENSE_AMOUNT: expense_amount,
            EXPENSE_DATE: expense_date,
            DESCRIPTION: description || null,
            EMAIL: userEmail,
        };

        await execute(query, binds);

        res.status(200).json({ message: 'Expense added successfully' });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Failed to add expense' });
    }
};

// Update an existing expense
export const updateExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { expense_id, expense_title, category_name, expense_amount, expense_date, description } = req.body;
        const userEmail = req.user?.email;

        const categoryQuery = `
            SELECT "CATEGORY_ID"
            FROM "C.SMELTZER"."BUDGETCATEGORY"
            WHERE LOWER("CATEGORY_NAME") = LOWER(:CATEGORY_NAME)
              AND LOWER("EMAIL") = LOWER(:EMAIL)
        `;
        const categoryBinds = {
            CATEGORY_NAME: category_name,
            EMAIL: userEmail,
        };

        const categoryResult = await execute(categoryQuery, categoryBinds);

        if (!categoryResult.rows || categoryResult.rows.length === 0) {
            res.status(404).json({ error: 'Category not found for the given user' });
            return;
        }

        const categoryId = categoryResult.rows[0][0]; // Access CATEGORY_ID directly from the first row

        const query = `
            UPDATE "C.SMELTZER"."EXPENSE"
            SET 
                "EXPENSE_TITLE" = :EXPENSE_TITLE,
                "CATEGORY_ID" = :CATEGORY_ID,
                "EXPENSE_AMOUNT" = :EXPENSE_AMOUNT,
                "EXPENSE_DATE" = TO_DATE(:EXPENSE_DATE, 'YYYY-MM-DD'),
                "DESCRIPTION" = :DESCRIPTION
            WHERE "EXPENSE_ID" = :EXPENSE_ID
        `;
        const binds = {
            EXPENSE_ID: expense_id,
            EXPENSE_TITLE: expense_title,
            CATEGORY_ID: categoryId,
            EXPENSE_AMOUNT: expense_amount,
            EXPENSE_DATE: expense_date,
            DESCRIPTION: description || null,
        };

        await execute(query, binds);

        res.status(200).json({ message: 'Expense updated successfully' });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ error: 'Failed to update expense' });
    }
};

// Delete an expense
export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { expense_id } = req.body;

        const query = `
            DELETE FROM "C.SMELTZER"."EXPENSE"
            WHERE "EXPENSE_ID" = :EXPENSE_ID
        `;

        const binds = { EXPENSE_ID: expense_id };

        await execute(query, binds);

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};
