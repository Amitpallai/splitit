"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
exports.config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
};
