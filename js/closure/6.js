// 首先创建一个add 函数 参数不确定
function add(){
  // 并且把保存参数的arguments赋值给args变量保存起来
  let args = Array.prototype.slice.call(arguments); 
  // 内部函数
  let inner = function(){
    args.push(...arguments);
    return inner;
  }
  return inner;
}