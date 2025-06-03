"use strict";

var _user;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// 独一无二的值
var sym = Symbol();
var sym1 = Symbol();
var sym2 = Symbol('desc'); // label 标签

console.log(_typeof(sym), sym); // Symbol()

console.log(sym === sym1); // false
// symbol 可以用于对象的key
// 使用 Symbol 构造函数实例化，一个标记为 id 的唯一值ID
// ID 唯一性， Symbol  

var ID = Symbol('id'); // es6 之前 key  string 类型
// symbol 作为 key

var sex = '男';
var num = 1;
var age = Symbol('age');
var user = (_user = {
  "name": 'Alice',
  "age": 2
}, _defineProperty(_user, Symbol(), 3), _defineProperty(_user, ID, 123), _user);
user.age = 18; // console.log(user.name,user[ID],user.age,user[age]); // Alice 123
// 面向对象私有属性概念
// 对象的隐私， 内部需要 ， 不希望外界调用

for (var key in user) {
  // 遍历对象的key
  console.log(key, user[key], '---------'); // name age  ID  不希望遍历出来
}