"use strict";

// server.js - 原生 Node.js 版本
var http = require('http');

var server = http.createServer(function (req, res) {
  // 匹配 GET 请求 /say
  // es6 字符串方法
  if (req.url.startsWith('/say')) {
    // 解析查询参数（简单处理）
    var url = new URL(req.url, "http://".concat(req.headers.host));
    console.log(url, '///////');
    console.log(url.searchParams, '?????');
    var wd = url.searchParams.get('wd');
    var callback = url.searchParams.get('callback');
    console.log(wd); // Iloveyou

    console.log(callback); // show
    // 返回 JSONP 格式响应

    res.writeHead(200, {
      'Content-Type': 'application/javascript'
    });
    var data = {
      name: '张三',
      age: 18
    };
    res.end("".concat(callback, "(").concat(JSON.stringify(data), ")"));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});
server.listen(3000, function () {
  console.log('Server running at http://localhost:3000');
});