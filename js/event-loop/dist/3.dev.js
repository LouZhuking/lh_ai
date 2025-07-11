"use strict";

// Node.js 环境特有的微任务
console.log('Start'); // node 微任务
// process 进程对象

process.nextTick(function () {
  console.log('Process Next Tick');
}); // 微任务

Promise.resolve().then(function () {
  console.log('Promise Resolved');
}); // 宏任务

setTimeout(function () {
  console.log('haha');
  Promise.resolve().then(function () {
    console.log('inner Promise');
  });
}, 0);
console.log('end');