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
exports.verifyToken = exports.setAuthCookies = exports.createTokens = void 0;
var jose_1 = require("jose");
var headers_1 = require("next/headers");
var getJwtSecretKey = (function () {
    var secret = process.env.JWT_SECRET_KEY;
    if (!secret)
        throw new Error('JWT_SECRET_KEY is not set');
    return new TextEncoder().encode(secret);
});
exports.createTokens = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new jose_1.SignJWT({ userId: userId })
                    // 创建JWT 载荷
                    // 设置头部，指定使用HS256算法签名
                    .setProtectedHeader({ alg: 'HS256' })
                    // 颁发的时间 当前时间 
                    .setIssuedAt()
                    .setExpirationTime('15m')
                    // 使用secret签名
                    .setExpirationTime('7d')
                    .sign(getJwtSecretKey())];
            case 1:
                accessToken = _a.sent();
                refreshToken = '2';
                return [2 /*return*/, {
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }];
        }
    });
}); };
exports.setAuthCookies = function (accessToken, refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    var cookieStore;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, headers_1.cookies()];
            case 1:
                cookieStore = _a.sent();
                cookieStore.set('access_token', accessToken, {
                    // 黑客XSS 攻击 js 试图获取cookie
                    httpOnly: true,
                    maxAge: 60 * 15,
                    sameSite: 'strict',
                    path: '/'
                });
                cookieStore.set('refresh_token', accessToken, {
                    // 黑客XSS 攻击 js 试图获取cookie
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7,
                    sameSite: 'strict',
                    path: '/'
                });
                return [2 /*return*/];
        }
    });
}); };
exports.verifyToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, jose_1.jwtVerify(token, getJwtSecretKey())];
            case 1:
                payload = (_a.sent()).payload;
                return [2 /*return*/, payload];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
