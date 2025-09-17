import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tripRoutes from './routes/trip.routes';
import expenseRoutes from './routes/expense.routes';
import authMiddleware from './middleware/auth.middleware';
import errorMiddleware from './middleware/error.middleware';
import rateLimitMiddleware from './middleware/rateLimit.middleware';
import { config } from './config'; // ✅ import config

const app = express();

app.use(cors({
  origin: config.frontendUrl, // ✅ use from config
  credentials: true,
}));

app.use(express.json());
app.use(rateLimitMiddleware);

app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/trips', authMiddleware, tripRoutes);
app.use('/expenses', authMiddleware, expenseRoutes);

app.use(errorMiddleware);

export default app;
