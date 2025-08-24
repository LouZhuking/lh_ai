"use client";
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
    var _a = react_1.useState([]), todos = _a[0], setTodos = _a[1];
    var _b = react_1.useState(""), input = _b[0], setInput = _b[1];
    react_1.useEffect(function () {
        fetchTodos();
    }, []);
    var fetchTodos = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/api/todos")];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    setTodos(data);
                    return [2 /*return*/];
            }
        });
    }); };
    var addTodo = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, newTodo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!input.trim())
                        return [2 /*return*/];
                    return [4 /*yield*/, fetch('/api/todos', {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ title: input })
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    newTodo = _a.sent();
                    setTodos(__spreadArrays([newTodo], todos));
                    setInput("");
                    return [2 /*return*/];
            }
        });
    }); };
    var toggleTodo = function (id, completed) { return __awaiter(_this, void 0, void 0, function () {
        var res, updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/api/todos/" + id, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ completed: !completed })
                    })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    updated = _a.sent();
                    setTodos(todos.map(function (todo) { return todo.id === id ? updated : todo; }));
                    return [2 /*return*/];
            }
        });
    }); };
    var deleteTodo = function (id) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/api/todos/" + id, { method: "DELETE" })];
                case 1:
                    _a.sent();
                    setTodos(todos.filter(function (todo) { return todo.id !== id; }));
                    console.log(todos);
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("main", { className: "max-w-xl max-auto p-6" },
        React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Todos"),
        React.createElement("div", { className: "flex gap-2 mb-4" },
            React.createElement("input", { value: input, onChange: function (e) { return setInput(e.target.value); }, placeholder: "Add todo...", className: "border p-2 rounded flex-1", type: "text" }),
            React.createElement("button", { className: "bg-blue-500 text-white px-4 py-2\n        rounded hover:bg-blue-600", onClick: function () { return addTodo(); } }, "Add")),
        React.createElement("ul", { className: "space-y-2" }, todos.map(function (todo) { return (React.createElement("li", { key: todo.id, className: "flex justify-between items-center p-2 border rounded" },
            React.createElement("span", { onClick: function () { return toggleTodo(todo.id, todo.completed); }, className: "cursor-pointer select-none\n                  " + (todo.completed ? "line-through text-gray-500" : "") }, todo.title),
            React.createElement("button", { onClick: function () { return deleteTodo(todo.id); }, className: "text-red-500 hover:text-red-700" }, "X"))); }))));
}
exports["default"] = Home;
