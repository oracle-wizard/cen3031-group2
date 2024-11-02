import * as express from 'express';
import cors = require('cors');
import { initialize, close, execute } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json());

// Initialize the database connection pool
initialize().then(() => {
  console.log('Connected to Oracle Database');
}).catch((err) => {
  console.error('Failed to connect to Oracle Database:', err);
  process.exit(1); // Exit if the database connection fails
});

// Example route using the database
app.get('/api/data', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const rows = await execute('SELECT table_name FROM user_tables'); // Query to get table names
    res.json(rows || []); // Ensure rows is an array
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

