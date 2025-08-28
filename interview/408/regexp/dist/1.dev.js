"use strict";

var str = "我的手机号是13888888888,有空打给我。";
var str2 = "hello world";
var reg = /1[3-9][0-9]{9}/; // 简写方式

console.log(reg.test(str)); // console.log(reg.test(str2));

console.log(str.match(reg));
var str3 = "我的{name}";
console.log(str3.replace(/\{name\}/, "奶龙"));