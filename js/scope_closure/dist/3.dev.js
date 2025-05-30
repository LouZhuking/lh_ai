"use strict";

function foo() {
  var myName = "极客时间";
  var test1 = 1;
  var test2 = 2;
  var innerBar = {
    getName: function getName() {
      console.log(test1);
      return myName;
    },
    setName: function setName(newName) {
      myName = newName;
    }
  };
  return innerBar;
}

var bar = foo(); // 函数嵌套函数，  外部访问的时候
// 沿着词法作用域链，找到它申明的时候的函数中的变量
// 函数就好像有一个背包一样，里面放着外层函数的变量

bar.setName("极客邦");
bar.getName();
console.log(bar.getName());
/**
 * - oo() 执行阶段 ： 调用 foo() 时，会创建 foo 函数的执行上下文，其中声明了局部变量：

- var myName = "极客时间" （函数作用域内有效）
- let test1 = 1 （块级作用域内有效，但 foo 函数整体是一个块，因此实际作用域与函数作用域一致）
- const test2 = 2 （同理）
同时， innerBar 对象的 getName 和 setName 方法被定义，它们通过闭包 保留了对 foo 函数作用域中变量的引用 （即 myName 、 test1 等）。
- bar.setName("极客邦") 调用 ： setName 方法通过闭包修改了 foo 作用域中的 myName （值变为 "极客邦" ），但未影响 test1 （仍为 1 ）。
- 两次 bar.getName() 调用 ：

- 第一次调用 bar.getName() ： 执行 console.log(test1) ，由于 test1 在 foo 作用域中被闭包保留且未被修改，输出 1 ； 最终返回 myName （此时值为 "极客邦" ），但返回值未被 console.log 打印（仅执行了 bar.getName() 本身）。
- 第二次调用 console.log(bar.getName()) ： 再次执行 bar.getName() 时， console.log(test1) 会 再次输出 1 ； 随后 getName 返回 "极客邦" ，被外层 console.log 打印（但用户问题关注的是两个 1 ，因此此步骤的 "极客邦" 是额外输出）。
 */