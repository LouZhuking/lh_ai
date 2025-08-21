"use strict";

var _a = require("./a.js");

var _Hello = _interopRequireDefault(require("./Hello.jsx"));

require("./main.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 引入css 文件
document.getElementById('app').innerHTML = "\n  <h1>Webpack</h1>\n  \n  <p>".concat((0, _a.aMessage)(), "</p>\n");