// 定义 greeting 函数，使用 rest 参数 ...args 收集所有传入的参数
function greeting(...args) {
  // 注释掉的代码，原本用于打印 rest 参数和 arguments 对象中的参数
  // console.log(args, arguments[0], arguments[1]);
  // 返回一个包含 this.name 的字符串，用于打招呼
  return `hello, I am ${this.name}.`;
}

// 为 Function 原型添加自定义的 myCall 方法，用于模拟原生的 call 方法
// 传递参数从一个数组变成逐个传参，不用 ... 扩展运算符的也可以用 arguments 代替
Function.prototype.myCall = function(context, ...args) {
  // 处理 context 为 null 或 undefined 的情况，将其默认设置为 window 对象
  if (context === null || context === undefined) {
    context = window;
  }
  // 检查调用 myCall 方法的对象是否为函数，如果不是则抛出类型错误
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype.myCall called on non-function"
    );
  }
  // 创建一个唯一的 Symbol 值作为属性名，避免覆盖 context 上已有的属性
  const fnKey = Symbol("fn");
  // 将调用 myCall 方法的函数赋值给 context 的 fnKey 属性
  context[fnKey] = this;
  // 在 context 上下文中调用函数，并传入参数 ...args，将结果存储在 result 中
  const result = context[fnKey](...args);
  // 删除 context 上临时添加的属性，避免污染 context 对象
  delete context[fnKey];
  // 返回函数执行的结果
  return result;
}

// 定义一个对象 obj，包含 name 属性和一个空函数 fn
var obj = {
  name: 'xww',
  fn: function() {

  }
}
// 使用自定义的 myCall 方法调用 greeting 函数，将 this 绑定到 obj 对象，并传入参数 1, 2, 3
// 最后打印函数执行的结果
console.log(greeting.myCall(obj,1,2,3))
        