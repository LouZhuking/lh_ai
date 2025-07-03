"use strict";

var http = require("http"); // 引入 Node.js 的 fs 模块，用于文件系统操作


var fs = require("fs"); // file system
// 引入 Node.js 的 path 模块，用于处理和转换文件路径


var path = require("path"); // 路径模块 提供一些路径相关的方法
// 创建一个 HTTP 服务器实例，传入请求处理函数


var server = http.createServer(function (req, res) {
  // 注释掉的代码，原本用于直接返回响应内容
  // res.end('hello http server')
  // 说明 HTTP 是基于请求 - 响应的协议
  // http 基于请求响应的协议
  // 解释路由的概念，Method 和 url 组合可以定位服务器端的资源
  // 路由 Method + url 定位了服务器端的资源
  // 强调路由的作用是为了获取资源
  // 为了资源
  // 判断请求方法是否为 GET，并且请求路径是根路径或 /index.html
  if (req.method == "GET" && (req.url == "/" || req.url == "/index.html")) {
    // 打印当前文件所在目录和要读取的 index.html 文件的完整路径
    console.log(__dirname, path.join(__dirname, "public", "index.html")); // 异步读取 public 目录下的 index.html 文件

    fs.readFile(path.join(__dirname, "public", "index.html"), // 异步操作的回调函数，处理读取结果
    // 异步 callback
    function (err, content) {
      // 前端开发通常更注重用户体验，后端开发更注重稳定性
      // 前端体验为主
      // 后端稳定为主
      // 如果读取文件过程中出现错误
      if (err) {
        // 设置响应状态码为 500，表示服务器内部错误
        res.writeHead(500); // 5XX 服务器错误
        // 返回错误信息给客户端

        res.end("Server error"); // 结束当前函数执行，避免后续代码继续执行

        return;
      } // 说明响应内容不仅可以是 HTML，还可以是 CSS、JS、JPG 等格式
      // 不只是html, css, js, jpg
      // 设置响应状态码为 200，表示请求成功，并指定响应内容类型为 HTML


      res.writeHead(200, {
        "Content-Type": "text/html"
      }); // 将读取到的文件内容作为响应返回给客户端

      res.end(content);
    });
  }

  if (req.method == "GET" && req.url == "/style.css") {
    fs.readFile(path.join(__dirname, "public", "style.css"), function (err, content) {
      // 如果读取文件过程中出现错误
      if (err) {
        // 设置响应状态码为 500，表示服务器内部错误
        res.writeHead(500); // 返回错误信息给客户端

        res.end("Server error"); // 结束当前函数执行，避免后续代码继续执行

        return;
      } // 设置响应状态码为 200，表示请求成功，并指定响应内容类型为 CSS


      res.writeHead(200, {
        "Content-Type": "text/css"
      }); // 将读取到的文件内容作为响应返回给客户端

      res.end(content);
    }); // 结束当前请求处理，避免后续代码继续执行

    return;
  } // 判断请求方法是否为 GET，并且请求路径是 /script.js


  if (req.method == "GET" && req.url == "/script.js") {
    // 异步读取 public 目录下的 script.js 文件
    fs.readFile(path.join(__dirname, "public", "script.js"), function (err, content) {
      // 如果读取文件过程中出现错误
      if (err) {
        // 设置响应状态码为 500，表示服务器内部错误
        res.writeHead(500); // 返回错误信息给客户端

        res.end("Server error"); // 结束当前函数执行，避免后续代码继续执行

        return;
      } // 设置响应状态码为 200，表示请求成功，并指定响应内容类型为 JavaScript


      res.writeHead(200, {
        "Content-Type": "text/javascript"
      }); // 将读取到的文件内容作为响应返回给客户端

      res.end(content);
    }); // 结束当前请求处理，避免后续代码继续执行

    return;
  }

  if (req.method == 'POST' && req.url == '/login') {
    // 用户名和密码的校验
    res.writeHead(200, {
      // 服务器端设置的
      'Set-Cookie': "user=admin;",
      'Content-Type': "application/json"
    });
    res.end(JSON.stringify({
      success: true,
      msg: '登录成功'
    }));
  }

  if (req.method == 'GET' && req.url == '/check-login') {
    if (req.headers.cookie) {
      res.end(JSON.stringify({
        loggedIn: true,
        username: "admin"
      }));
    } else {
      res.end(JSON.stringify({
        loggedIn: false,
        username: ""
      }));
    }
  }
}); // 启动服务器，监听 8080 端口

server.listen(8080);