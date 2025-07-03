"use strict";

var http = require('http');

var fs = require('fs'); // file system


var path = require('path'); // 路径模块 提供一些路径相关的方法


var server = http.createServer(function (req, res) {
  // res.end('hello http server')
  // http 基于请求响应的协议
  if (req.method == 'GET' && req.url == '/') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), function (err, content) {
      if (err) {
        res.writeHead(500); // 5XX 服务器错误

        res.end('Server error');
        return;
      }

      res.end('hello http server');
    });
  }
});
server.listen(8080);