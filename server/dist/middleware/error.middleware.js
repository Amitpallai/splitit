"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Server error' });
};
exports.default = errorMiddleware;
