// 业务流水账代码
// 封装
function Button(id){
  this.element = document.querySelector(`#${id}`);
  console.log(this.element);
  this.bindEvent();
}

Button.prototype.bindEvent = function(){
  // this 丢失问题  // this Button // 封装里面的使用
  this.element.addEventListener('click',this.setBgColor.bind(this))
  // 事件执行必须为全新的函数，bind和call的区别
  // 为什么不用call 和 apply 因为call和apply调用后会立马运行
}
// 点击时是function
// 事件处理函数，事件触发调用时，this指向事件源

Button.prototype.setBgColor = function(){
  this.element.style.backgroundColor = '#1abc9c';
}