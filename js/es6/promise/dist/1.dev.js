"use strict";

// 读取文件的函数
// 读取1.html 里面的内容
// 读取完后 打印 读完了
var fs = require('fs'); // 引入js 内置的文件模块


var readFilePromise = new Promise(function (resolve, reject) {
  fs.readFile('./1.html', function (err, data) {
    console.log(data.toString());
    resolve(); // 当resolve运行的时候.then就可以执行
  });
});
readFilePromise.then(function () {
  // 函数 
  console.log('1111');
}); // readFile 是异步的