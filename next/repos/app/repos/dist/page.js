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
exports.__esModule = true;
var card_1 = require("@/components/ui/card");
function ReposPage() {
    return __awaiter(this, void 0, void 0, function () {
        var response, repos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('http://api.github.com/users/shunwuyu/repos')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    repos = _a.sent();
                    return [2 /*return*/, (React.createElement("main", { className: "container mx-auto p-4" },
                            React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "GitHub Repositories"),
                            React.createElement("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" }, repos.map(function (repo) { return (React.createElement(card_1.Card, { key: repo.id },
                                React.createElement(card_1.CardHeader, null,
                                    React.createElement(card_1.CardTitle, { className: "text-lg" },
                                        React.createElement("a", { href: repo.html_url, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:underline" }, repo.name))),
                                React.createElement(card_1.CardContent, null,
                                    React.createElement("p", { className: "text-gray-600 text-sm mb-2" }, repo.description || 'No description'),
                                    React.createElement("div", { className: "flex items-center gap-4 text-sm" },
                                        repo.language && (React.createElement("span", { className: "flex items-center gap-1" },
                                            React.createElement("span", { className: "w-3 h-3 rounded-full bg-gray-400" }),
                                            repo.language)),
                                        React.createElement("span", { className: "flex items-center gap-1" },
                                            "\u2B50 ",
                                            repo.stargazers_count))))); }))))];
            }
        });
    });
}
exports["default"] = ReposPage;
