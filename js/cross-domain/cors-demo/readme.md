# 进阶跨域方案 cors

- 日常用的最多的跨域解决方案
  JSONP 不跨域
  cors 跨域的
  浏览器会发送 **CROS** 请求，如果服务器端的响应头设置了 Access-Control-Allow-Origin,
  后端实现了 CROS

  - 可以给出白名单，对前后端都安全

  - 简单跨域请求
    GET/POST 简单设置下 Access-Control-Allow-Origin 就好
    Content-Type text/plain multipart/form-data
    application/x-www-form-urlencoded
  - 复杂跨域请求
    其他的方法 安全升级
    - ## 预检请求
    - 真正的请求
