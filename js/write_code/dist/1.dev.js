"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// 完成的功能
// es6 版本
function objectFactory(Constructor) {
  // 1.创建一个新的空对象
  var obj = {}; // 类数组上没有shift方法，所以借用数组的shift方法
  // var Constructor = [].shift.call(arguments); // 构造函数

  obj.__proto__ = Constructor.prototype;

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var result = Constructor.apply(obj, args); // 4. 如果构造函数返回的是一个对象，则返回这个对象；否则返回新创建的对象
  // || null 的情况 仍然会返回object 简单类型，忽略  

  return _typeof(result) === 'object' ? result || obj : obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
  return null; // return{
  //   name:name,
  //   age:age,
  //   label:'haha'
  // }
}

Person.prototype.sayHi = function () {
  console.log("Hello,my name is ".concat(this.name, " and I'm ").concat(this.age, " years old"));
};

var p1 = new Person('张三', 18);
console.log(p1); // p.sayHi()

var p = objectFactory(Person, 'ZS', 18);
console.log(p);
p.sayHi();
console.log(p instanceof Person); // new Person(...) -> function [[construct]]->{} -> [[call]]
// -> {}.__proto__ -> Construct.prototype -> return {}