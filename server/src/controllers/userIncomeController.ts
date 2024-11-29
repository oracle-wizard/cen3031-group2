import { Request, Response } from 'express';
import { execute } from '../database'; // Assuming a utility to execute SQL queries

// Fetch the user's income
export const getUserIncome = async (req: Request, res: Response): Promise<void> => {
    try {
        const userEmail = req.user?.email; // Retrieve logged-in user's email
        if (!userEmail) {
            res.status(400).json({ error: 'User email not found in request' });
            return;
        }

        const query = `
            SELECT "MONEY_ID", "TOTAL_INCOME", "MONEY_REMAINING"
            FROM "C.SMELTZER"."MONEY"
            WHERE LOWER("EMAIL") = LOWER(:EMAIL)
        `;

        const binds = { EMAIL: userEmail };
        
        // Define the expected type of rows
        type MoneyRow = [number, number, number]; // Define the types of MONEY_ID, TOTAL_INCOME, and MONEY_REMAINING

        const result = await execute(query, binds) as { rows: MoneyRow[] };

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Income record not found' });
            return;
        }

        const [MONEY_ID, TOTAL_INCOME, MONEY_REMAINING] = result.rows[0];
        res.status(200).json({ MONEY_ID, TOTAL_INCOME, MONEY_REMAINING });
    } catch (error) {
        console.error('Error fetching user income:', error);
        res.status(500).json({ error: 'Failed to retrieve user income' });
    }
};




// Update the user's income
export const updateUserIncome = async (req: Request, res: Response) => {
    try {
        const { total_income } = req.body;

        const query = `
            UPDATE "C.SMELTZER"."MONEY"
            SET "TOTAL_INCOME" = :TOTAL_INCOME, 
                "MONEY_REMAINING" = :TOTAL_INCOME
            WHERE LOWER("EMAIL") = LOWER(:EMAIL)
        `;

        const binds = {
            TOTAL_INCOME: total_income,
            EMAIL: req.user?.email
        };

        await execute(query, binds);

        res.status(200).json({ message: 'User income updated successfully' });
    } catch (error) {
        console.error('Error updating user income:', error);
        res.status(500).json({ error: 'Failed to update user income' });
    }
};
