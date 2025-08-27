'use client'; // 组件在客户端执行
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
function Home() {
    var _this = this;
    var _a = react_1.useState([]), messages = _a[0], setMessages = _a[1];
    var _b = react_1.useState(""), input = _b[0], setInput = _b[1];
    var _c = react_1.useState(false), isLoading = _c[0], setIsLoading = _c[1];
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var userMessage, res, data, assistantMessage_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!input.trim() || isLoading)
                        return [2 /*return*/];
                    userMessage = {
                        role: 'user',
                        content: input
                    };
                    setMessages(function (prev) { return __spreadArrays(prev, [userMessage]); });
                    setInput("");
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch('/api/chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ messages: __spreadArrays(messages, [userMessage]) })
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    assistantMessage_1 = data.message;
                    setMessages(function (prev) { return __spreadArrays(prev, [assistantMessage_1]); });
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "flex flex-col h-screen bg-gray-100" },
        React.createElement("div", { className: "flex-1 overflow-y-auto p-4 space-y-4" },
            messages.length === 0 ? (React.createElement("p", { className: "text-center text-gray-500 mt-10" }, "\u5F00\u59CB\u4E0Edeepseek\u6A21\u578B\u804A\u5929\u5427")) : (messages.map(function (msg, idx) { return (React.createElement("div", { key: msg.content, className: "flex " + (msg.role === 'user' ? 'justify-end' : 'justify-start') },
                React.createElement("div", { className: "max-w-xs lg:max-w-md px-4 py-2 rounded-lg\n                        " + (msg.role === 'user' ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 shadow') + "\n                      " },
                    React.createElement("p", null, msg.content)))); })),
            isLoading && (React.createElement("div", { className: "flex justify-start" },
                React.createElement("div", { className: "bg-white text-gray-800 shadow px-4 py-2\n                  rounded-lg max-w-xs lg:max-w-md\n                " },
                    React.createElement("p", null, "DeepSeek\u6B63\u5728\u601D\u8003..."))))),
        React.createElement("div", { className: "p-4 bg-white border-t" },
            React.createElement("form", { onSubmit: handleSubmit, className: "flex space-x-2" },
                React.createElement("input", { type: "text", value: input, onChange: function (e) { return setInput(e.target.value); }, placeholder: "\u8F93\u5165\u4F60\u7684\u6D88\u606F", className: "flex-1 p-2 border rounded-lg \n              focus:outline-none focus:ring-2 focus:ring-blue-500" }),
                React.createElement("button", { type: "submit", disabled: isLoading, className: "px-4 py-2 bg-blue-500 text-white rounded-lg\n              hover: bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed" }, isLoading ? '发送中' : '发送...')))));
}
exports["default"] = Home;
