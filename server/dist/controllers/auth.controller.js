"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.isAuth = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const validator_1 = require("../utils/validator");
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
// ---------------- Signup ----------------
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = validator_1.signupSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ success: false, message: validation.error.issues[0].message });
        }
        const { username, email, password } = validation.data;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.default.create({ username, email, password: hashedPassword });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: COOKIE_MAX_AGE,
        });
        res.status(201).json({
            success: true,
            user: { username: user.username, email: user.email },
            token,
            message: "Signed up successfully",
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.signup = signup;
// ---------------- Login ----------------
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = validator_1.loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ success: false, message: validation.error.issues[0].message });
        }
        const { email, password } = validation.data;
        const user = yield User_1.default.findOne({ email });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: COOKIE_MAX_AGE,
        });
        res.status(200).json({
            success: true,
            user: { username: user.username, email: user.email },
            token,
            message: "Logged in successfully",
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.login = login;
// ---------------- Check Auth ----------------
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield User_1.default.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.isAuth = isAuth;
// ---------------- Logout ----------------
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.json({ success: true, message: 'Logged out successfully' });
    }
    catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
});
exports.logout = logout;
