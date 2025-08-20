"use strict";

// thenable
function light(color, time) {
  console.log(color);
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
}

function loop() {
  light('red', 1000) // 控制流程 异步变同步
  .then(function () {
    return light('yellow', 3000);
  }) // 当返回值也是promise的时候，继续 thenable
  .then(function () {
    return light('green', 2000);
  }).then(loop); // 递归
}

loop();