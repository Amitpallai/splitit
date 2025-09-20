"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.signJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../config/index");
const signJWT = (payload) => {
    return jsonwebtoken_1.default.sign(payload, index_1.config.jwtSecret, { expiresIn: '1d' });
};
exports.signJWT = signJWT;
const verifyJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, index_1.config.jwtSecret);
};
exports.verifyJWT = verifyJWT;
