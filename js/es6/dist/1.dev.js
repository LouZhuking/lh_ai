"use strict";

var name = 'DuoDuo';
var age = 2; // 字符串模版 template string
// 字符串拼接告别 更优雅的字符串模版

var sentence = "My dog ".concat(name, " is ").concat(age * 7, " years old");
console.log(sentence);