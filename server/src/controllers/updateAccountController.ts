import { Request, Response } from 'express';
import { execute } from '../database';

export const updateAccount = async (req: Request, res: Response) => {
  try {
      const { firstName, lastName, newEmail } = req.body;

      const query = `
          UPDATE "C.SMELTZER"."USERS"
          SET 
              "FIRST_NAME" = :FIRST_NAME,
              "LAST_NAME" = :LAST_NAME,
              "EMAIL" = :NEW_EMAIL
          WHERE "EMAIL" = :OLD_EMAIL
      `;
      
      const binds = {
          FIRST_NAME: firstName,
          LAST_NAME: lastName,
          OLD_EMAIL: req.user?.email,
          NEW_EMAIL: newEmail
      };

      await execute(query, binds);

      res.status(200).json({ message: 'Account updated successfully' });
  } catch (error) {
      console.error('Error updating account:', error);
      res.status(500).json({ error: 'Failed to update account' });
  }
};
