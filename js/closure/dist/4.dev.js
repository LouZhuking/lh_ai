"use strict";

// 参数复用 接收三个参数
function url_curring(protocol) {
  return function (hostname, pathname) {
    return "".concat(protocol).concat(hostname).concat(pathname);
  };
}

var url_https = url_curring('https://');
var url2 = url_https('www.danlaoshi.com', '/点赞');
var url3 = url_https('www.danlaoshi.com', '/投币');
var url4 = url_https('www.danlaoshi.com', '/收藏');
console.log(url2, url3, url4);