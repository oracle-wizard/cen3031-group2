import { Request, Response } from 'express';
import { execute } from '../database'; // Assuming you have a utility to execute SQL queries

// Fetch all budget categories for the logged-in user
export const getBudgetCategories = async (req: Request, res: Response) => {
    try {
        const userEmail = req.user?.email; // Retrieve the logged-in user's email
        if (!userEmail) {
            throw new Error("User email not found in request");
        }

        const query = `
            SELECT 
                "CATEGORY_NAME", 
                "ALLOCATED_AMOUNT"
            FROM "C.SMELTZER"."BUDGETCATEGORY"
            WHERE LOWER("EMAIL") = LOWER(:EMAIL)
        `;

        // Correctly structure the bind variable
        const binds = {
            EMAIL: { val: userEmail }, // Use `val` to specify the value
        };

        const result = await execute(query, binds);

        // Log the results for debugging
        console.log("Fetched Budget Categories:", result.rows);
        console.log("User Email:", userEmail);
        console.log("Bind Object:", binds);
        console.log("Query Result:", result.rows);


        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching budget categories:', error);
        res.status(500).json({ error: 'Failed to retrieve budget categories' });
    }
};


// Add a new budget category
export const addBudgetCategory = async (req: Request, res: Response) => {
    try {
        const userEmail = req.user?.email; // Retrieve the logged-in user's email
        const { category_name, allocated_amount } = req.body;

        const query = `
            INSERT INTO "C.SMELTZER"."BUDGETCATEGORY" (
                "CATEGORY_NAME", 
                "ALLOCATED_AMOUNT", 
                "TOTAL_SPENT", 
                "EMAIL"
            ) VALUES (
                :CATEGORY_NAME, 
                :ALLOCATED_AMOUNT, 
                0, 
                :EMAIL
            )
        `;

        const binds = {
            CATEGORY_NAME: category_name,
            ALLOCATED_AMOUNT: allocated_amount,
            EMAIL: userEmail
        };

        await execute(query, binds);

        res.status(200).json({ message: 'Budget category added successfully' });
    } catch (error) {
        console.error('Error adding budget category:', error);
        res.status(500).json({ error: 'Failed to add budget category' });
    }
};

// Update a budget category
export const updateBudgetCategory = async (req: Request, res: Response) => {
    try {
        const { category_name, allocated_amount, new_category_name } = req.body;

        const query = `
            UPDATE "C.SMELTZER"."BUDGETCATEGORY"
            SET 
                "ALLOCATED_AMOUNT" = :ALLOCATED_AMOUNT,
                "CATEGORY_NAME" = :NEW_CATEGORY_NAME
            WHERE "CATEGORY_NAME" = :CATEGORY_NAME
              AND LOWER("EMAIL") = LOWER(:EMAIL)
        `;

        const binds = {
            CATEGORY_NAME: category_name,
            NEW_CATEGORY_NAME: new_category_name || category_name, // Keep the old name if no new name is provided
            ALLOCATED_AMOUNT: allocated_amount,
            EMAIL: req.user?.email
        };

        await execute(query, binds);

        res.status(200).json({ message: 'Budget category updated successfully' });
    } catch (error) {
        console.error('Error updating budget category:', error);
        res.status(500).json({ error: 'Failed to update budget category' });
    }
};


// Delete a budget category
export const deleteBudgetCategory = async (req: Request, res: Response) => {
    try {
        const { category_name } = req.body;

        const query = `
            DELETE FROM "C.SMELTZER"."BUDGETCATEGORY"
            WHERE "CATEGORY_NAME" = :CATEGORY_NAME
              AND LOWER("EMAIL") = LOWER(:EMAIL)
        `;

        const binds = {
            CATEGORY_NAME: category_name,
            EMAIL: req.user?.email
        };

        await execute(query, binds);

        res.status(200).json({ message: 'Budget category deleted successfully' });
    } catch (error) {
        console.error('Error deleting budget category:', error);
        res.status(500).json({ error: 'Failed to delete budget category' });
    }
};
