"use strict";

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// es6 模块化
// mjs 后缀使用es6模块化
// 模块化是语言的能力
// node 默认不支持es6 模块化
// node 最新版本支持了 22
// node 准备跟require commonjs say goodbye
// es6 module 更先进  mjs
var server = _http["default"].createServer(function (req, res) {
  res.end('hello World');
});

server.listen(1314);