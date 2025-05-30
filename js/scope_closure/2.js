function bar() {
  var myName = "极客世界"
  let test1 = 100
  if (1) {
      let myName = "Chrome浏览器"
      console.log(test)     // 1
  }
}
function foo() {
  var myName = "极客邦"
  let test = 2
  { // 花括号 创建 块级作用域
      let test = 3
      bar() // 跳出 foo 函数， 执行 bar 函数
  }
}
var myName = "极客时间"
let myAge = 10
let test = 1
foo()
// 