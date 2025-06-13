"use strict";

// add 函数，3个参数
// add.length 3
function add(a, b, c) {
  return a + b + c;
}

add(1, 2, 3);

function curry(fn) {
  // fn ? 参数 最终要执行的功能,  闭包中的自由变量  词法定义环境
  // curry 函数 包装fn, 慢慢收集参数
  // ...args 所有的参数  自由变量
  var judge = function judge() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // es6 reset 运算符
    // 任何地方都可以访问到定义时候的fn
    if (args.length == fn.length) {
      // 退出条件
      return fn.apply(void 0, args);
    }

    return function () {
      for (var _len2 = arguments.length, newArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        newArgs[_key2] = arguments[_key2];
      }

      return judge.apply(void 0, args.concat(newArgs));
    };
  };

  return judge;
} // 柯里化  手写curry 函数


var addCurry = curry(add); // 逐步的去获取函数需要的参数，当到达fn 需要的参数数量时，执行结果。

console.log(addCurry(1)(2)(3)); // 慢慢传参