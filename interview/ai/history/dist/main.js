"use strict";
exports.__esModule = true;
var openai_1 = require("openai");
var dotenv_1 = require("dotenv");
dotenv_1.config();
var client = new openai_1["default"]({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
});
var summary = "用户的基本信息";
var messages = [];
