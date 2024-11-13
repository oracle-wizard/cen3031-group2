// controllers/expenseController.ts
import { Request, Response } from 'express';
import { execute } from '../database';

export const getExpenses = async (req: Request, res: Response) => {
    try {
      // Get the logged-in user's email
      const userEmail = req.user?.email;
      console.log("Logged-in user's email:", userEmail); // Debugging log
  
      // Query to fetch expenses based on the logged-in user's email
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
  
      const binds = { EMAIL: userEmail };
      console.log("Executing query with binds:", query);
      console.log("With binds:", binds);
  
      // Execute the query
      const result = await execute(query, binds);
      console.log("Fetched expenses:", result.rows);
  
      // Return the fetched expenses as the response
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Failed to retrieve expenses' });
    }
  };
  
