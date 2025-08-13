"use strict";

// # 怎么用的 参数的默认值
// 默认值， 用户会传的，  Object.assign 收入囊中
// 目标对象是{}空对象 合并用户传参和默认参数, 合并配置对象
// Option  是会传入的对象
function createUser(options) {
  var defaults = {
    name: '匿名用户',
    age: 18,
    isAdmin: false
  };
  var config = Object.assign({}, defaults, options);
  console.log(config);
}

createUser({
  name: '李四',
  age: 25
});
var baseConfig = {
  api: '/api',
  timeout: 500
};
var eventConfig = {
  timeout: 10000,
  debug: true
};
var finalConfig = Object.assign({}, baseConfig, eventConfig);
console.log(finalConfig);