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

export default router;
