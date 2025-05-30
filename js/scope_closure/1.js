function bar(){
  console.log(myName); 
  // 作用域查找
}
function foo(){
  var myName = '极客'
  bar()
}

var myName = '骑士'
foo()