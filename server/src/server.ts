import * as express from 'express';
const cors = require('cors');
import userRoutes from './routes/userRoutes';
import { closePool, initialize } from './database';
import  * as cookieParser from 'cookie-parser'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())

// Initialize the database connection pool
initialize()
  .then(() => console.log('Database connected'))
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1); // Exit if database connection fails
  });

app.use('/api', userRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await closePool();  // Close the database pool
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

// Listen for termination signals
process.on('SIGINT', gracefulShutdown);  // Handle Ctrl+C in terminal
process.on('SIGTERM', gracefulShutdown); // Handle termination signal from system
