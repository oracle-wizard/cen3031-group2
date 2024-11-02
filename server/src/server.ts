import * as express from 'express';
import cors = require('cors');
import { initialize, close, execute } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

// Initialize the database connection pool
initialize().then(() => {
  console.log('Connected to Oracle Database');
}).catch((err) => {
  console.error('Failed to connect to Oracle Database:', err);
  process.exit(1); // Exit if the database connection fails
});

// Registration endpoint
app.post('/api/register', async (req: express.Request, res: express.Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ error: 'Please provide all required fields.' });
    return;
  }

  try {
    const query = `
      INSERT INTO users (first_name, last_name, email, password, created_at)
      VALUES (:firstName, :lastName, :email, :password, CURRENT_TIMESTAMP)
    `;

    // Execute the query with parameters to prevent SQL injection
    await execute(query, [firstName, lastName, email, password]);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Close the database connection pool on server shutdown
process.on('SIGINT', async () => {
  await close();
  process.exit(0);
});
