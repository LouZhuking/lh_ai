"use strict";

// node 运行 global 顶级对象
// global.gc();  // 手动触发垃圾回收
console.log(process.memoryUsage());
var map = new Map();
var key = new Array(1000000);
map.set(key, 1);
console.log(process.memoryUsage()); // console.log();

key = null; // 手动释放

console.log(process.memoryUsage());
map = null;
global.gc();
console.log(process.memoryUsage());