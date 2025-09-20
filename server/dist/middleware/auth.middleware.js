"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
function authMiddleware(req, res, next) {
    var _a, _b;
    try {
        const token = ((_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "")) || ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.token);
        if (!token)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.userId; // match your JWT payload key
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}
