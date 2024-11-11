import * as express from 'express';
const cors = require('cors');
import userRoutes from './routes/userRoutes';
import { initialize } from './database';
import  * as cookieParser from 'cookie-parser'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())

initialize()
  .then(() => console.log('Database connected'))
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
