"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var userHandler_1 = __importDefault(require("./handlers/userHandler"));
var productHandler_1 = __importDefault(require("./handlers/productHandler"));
var orderHandler_1 = __importDefault(require("./handlers/orderHandler"));
var app = (0, express_1["default"])();
var port = 3000;
app.use(express_1["default"].json());
app.get('/', function (_req, res) {
    res.send('Welcome to the store!');
});
(0, userHandler_1["default"])(app);
(0, productHandler_1["default"])(app);
(0, orderHandler_1["default"])(app);
app.listen(port, function () {
    console.log("server started at http://localhost:".concat(port));
});
exports["default"] = app;
