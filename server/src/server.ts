import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tripRoutes from './routes/trip.routes';
import expenseRoutes from './routes/expense.routes';
import authMiddleware from './middleware/auth.middleware';
import errorMiddleware from './middleware/error.middleware';
import rateLimitMiddleware from './middleware/rateLimit.middleware';
import { config } from './config'; // ✅ import config
import connectDB from './db/mongoose';

const app = express();

// Use port from config or fallback to Vercel's dynamic port
const PORT = process.env.PORT || config.port || 5000;

app.use(cors({
  origin: config.frontendUrl, // ✅ use from config
  credentials: true,
}));

// ✅ Import Request & Response properly
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Splitit API!");
});

app.use(express.json());
app.use(rateLimitMiddleware);

app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/trips', authMiddleware, tripRoutes);
app.use('/expenses', authMiddleware, expenseRoutes);

app.use(errorMiddleware);

// Connect to MongoDB on server start
connectDB().catch(err => console.error('MongoDB connection error:', err));

// For local development only: Comment this out or remove for Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;