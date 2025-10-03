"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const trip_routes_1 = __importDefault(require("./routes/trip.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const rateLimit_middleware_1 = __importDefault(require("./middleware/rateLimit.middleware"));
const config_1 = require("./config"); // ✅ import config
const mongoose_1 = __importDefault(require("./db/mongoose"));
const app = (0, express_1.default)();
// Use port from config or fallback to Vercel's dynamic port
const PORT = process.env.PORT || config_1.config.port || 5000;
app.use((0, cors_1.default)({
    origin: config_1.config.frontendUrl, // ✅ use from config
    credentials: true,
}));
// ✅ Import Request & Response properly
app.get("/", (req, res) => {
    res.send("Welcome to the Splitit API!");
});
app.use(express_1.default.json());
app.use(rateLimit_middleware_1.default);
app.use('/auth', auth_routes_1.default);
app.use('/users', auth_middleware_1.default, user_routes_1.default);
app.use('/trips', auth_middleware_1.default, trip_routes_1.default);
app.use('/expenses', auth_middleware_1.default, expense_routes_1.default);
app.use(error_middleware_1.default);
// Connect to MongoDB on server start
(0, mongoose_1.default)().catch(err => console.error('MongoDB connection error:', err));
// For local development only: Comment this out or remove for Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}
exports.default = app;
