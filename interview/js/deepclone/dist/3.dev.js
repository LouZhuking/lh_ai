"use strict";

var target = {
  a: 1
};
var source = {
  // 对象的嵌套
  b: {
    name: '小明',
    hobbies: ["篮球", "足球"]
  },
  c: 1
}; // 浅拷贝

Object.assign(target, source);
target.b.name = "小红";
target.b.hobbies.push("跑步");
target.c = 2; // 这里可以看见c没有被改变,

console.log(source.b.name, source.b.hobbies, source.c);