import { config } from './config/index';
import connectDB from './db/mongoose';
import app from './app';

const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

startServer();