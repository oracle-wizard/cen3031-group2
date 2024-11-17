import { Request, Response } from 'express';
import { execute } from '../database';

export const getExpenses = async (req: Request, res: Response) => {
  try {
      // Extract only the email from req.user
      const userEmail = req.user?.email;
      if (!userEmail) {
          throw new Error("User email not found in request");
      }
      console.log("Logged-in user's email:", userEmail);

      const query = `
          SELECT 
            "EXPENSE_ID", 
            "EXPENSE_TITLE", 
            "CATEGORY_NAME", 
            "EXPENSE_AMOUNT", 
            "EXPENSE_DATE", 
            "DESCRIPTION",
            "EMAIL"
          FROM "C.SMELTZER"."EXPENSE"
          WHERE LOWER("EMAIL") = LOWER(:EMAIL)
      `;

      const binds = { EMAIL: userEmail }; // Bind only the email
      console.log("Executing query with binds:", binds);

      // Execute the query
      const result = await execute(query, binds);
      console.log("Result rows:", result.rows);

      // Send only the rows to the client
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
};

export const addExpense = async (req: Request, res: Response) => {
    try {
        const userEmail = req.user?.email; // Ensure the user's email is available
        console.log("Logged-in user's email in addExpense:", userEmail); // Debugging

        const { expense_title, category_name, expense_amount, expense_date, description } = req.body;

        const query = `
            INSERT INTO "C.SMELTZER"."EXPENSE" (
                "EXPENSE_TITLE", 
                "CATEGORY_NAME", 
                "EXPENSE_AMOUNT", 
                "EXPENSE_DATE", 
                "DESCRIPTION", 
                "EMAIL"
            ) VALUES (
                :EXPENSE_TITLE, 
                :CATEGORY_NAME, 
                :EXPENSE_AMOUNT, 
                TO_DATE(:EXPENSE_DATE, 'YYYY-MM-DD'), 
                :DESCRIPTION, 
                :EMAIL
            )
        `;

        const binds = {
            EXPENSE_TITLE: expense_title,
            CATEGORY_NAME: category_name,
            EXPENSE_AMOUNT: expense_amount,
            EXPENSE_DATE: expense_date,
            DESCRIPTION: description || null,
            EMAIL: userEmail
        };

        console.log("Insert binds:", binds); // Debugging log to see if EMAIL is being passed

        await execute(query, binds);

        res.status(200).json({ message: 'Expense added successfully' });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Failed to add expense' });
    }
};
export const updateExpense = async (req: Request, res: Response) => {
  try {
      const { expense_id, expense_title, category_name, expense_amount, expense_date, description } = req.body;

      const query = `
          UPDATE "C.SMELTZER"."EXPENSE"
          SET 
              "EXPENSE_TITLE" = :EXPENSE_TITLE,
              "CATEGORY_NAME" = :CATEGORY_NAME,
              "EXPENSE_AMOUNT" = :EXPENSE_AMOUNT,
              "EXPENSE_DATE" = TO_DATE(:EXPENSE_DATE, 'YYYY-MM-DD'),
              "DESCRIPTION" = :DESCRIPTION
          WHERE "EXPENSE_ID" = :EXPENSE_ID
      `;

      const binds = {
          EXPENSE_ID: expense_id,
          EXPENSE_TITLE: expense_title,
          CATEGORY_NAME: category_name,
          EXPENSE_AMOUNT: expense_amount,
          EXPENSE_DATE: expense_date,
          DESCRIPTION: description || null
      };

      await execute(query, binds);

      res.status(200).json({ message: 'Expense updated successfully' });
  } catch (error) {
      console.error('Error updating expense:', error);
      res.status(500).json({ error: 'Failed to update expense' });
  }
};
export const deleteExpense = async (req: Request, res: Response) => {
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
