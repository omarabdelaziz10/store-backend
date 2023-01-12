"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.verifyToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var TOKEN_SECRET = process.env.TOKEN_SECRET;
var verifyToken = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        var token = authHeader.split(' ')[1];
        jsonwebtoken_1["default"].verify(token, TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).send('Access denied, Invalid Token');
    }
    return next();
};
exports.verifyToken = verifyToken;
