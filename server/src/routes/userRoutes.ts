import { Router } from 'express';
import { execute } from '../database';

const router = Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const query = `
    INSERT INTO "C.SMELTZER".users (first_name, last_name, email, password)
    VALUES (:firstName, :lastName, :email, :password)
  `;

  try {
    await execute(query, { firstName, lastName, email, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/delete', async (req, res) => {
  const { email } = req.body;
  const query = `
    DELETE FROM "C.SMELTZER".users WHERE email = :email
  `;

  try {
    const result = await execute(query, { email });
    
    if (result?.rowsAffected && result.rowsAffected > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during user deletion:', error);
    res.status(500).json({ error: 'Deletion failed' });
  }
});

router.put('/update-profile', async (req, res) => {
  const { username, email, firstName, lastName } = req.body;
  const query = `
    UPDATE "C.SMELTZER".users
    SET email = :email, first_name = :firstName, last_name = :lastName
    WHERE username = :username
`;
  try {
    await execute(query, [email, firstName, lastName, username], { autoCommit: true });
    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;
