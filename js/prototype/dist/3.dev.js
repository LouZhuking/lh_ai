"use strict";

// 没有class 的 js 如何在苦苦追求 OOP
// 首字母大写 约定 1. 类的概念
// 2. 构造函数 
function Person(name, age) {
  // this 指向当前实例化的对象
  this.name = name;
  this.age = age;
} // 函数对象  原型对象
// 类的方法


Person.prototype = {
  sayHello: function sayHello() {
    console.log("Hello, my name is ".concat(this.name));
  }
}; // new 一下 实例化对象
// new 运行构造函数

var hu = new Person('吉他胡', 18); // hu 是一个实例化对象

hu.sayHello(); // 原型对象

var o = {
  name: 'o',
  age: 18
};
console.log(hu.__proto__);
console.log(o.toString()); // console.log(new Person('小公主',18)) // 实例化 类的概念 构造函数 实例对象