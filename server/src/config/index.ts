import dotenv from 'dotenv';

dotenv.config();

// Fail fast if required environment variables are missing
if (!process.env.MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined in .env");
}

if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in .env");
}

if (!process.env.FRONTEND_URL) {
  throw new Error("❌ FRONTEND_URL is not defined in .env");
}

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL,
};
