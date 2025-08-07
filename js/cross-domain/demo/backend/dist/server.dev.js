"use strict";

// commonjs 模块化
var http = require('http'); // js 异步 异步无阻塞
// node 天生性能好 相同的用户访问数，使用的服务器数量少，更便宜


var server = http.createServer(function (req, res) {
  if (req.url === '/api/hello' && req.method === 'GET') {
    console.log('//////');
    res.writeHead(200, {
      // 响应头是javascript
      'Content-Type': 'text/javascript' // 'Content-Type': 'application/json'

    }); // JSON 

    var data = {
      code: 0,
      msg: '字节，我来了'
    }; // json with padding

    res.end("callback(" + JSON.stringify(data) + ")"); // res.end("console.log('Hello from Node.js backend')")
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
}); // 服务器程序在8080 端口上运行

server.listen(8080, function () {
  console.log('Server is running on port 8080');
});