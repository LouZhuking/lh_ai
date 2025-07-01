function greeting(...args) {
  // console.log(args, arguments[0], arguments[1]);
  return `hello, I am ${this.name}.`;
}

Function.prototype.myCall = function(context,...args){
  if(context === null || context === undefined){
    context = window;
  }
  if(typeof this !== "function"){
    throw new TypeError(
      "Function.prototype.myCall called on non-function"
    );
  }
  const fnKey = Symbol("fn");
  context[fnKey] = this;
  const result = context[fnKey](...args);
  delete context[fnKey];
  return result;
}

var obj = {
  name: 'xww',
  fn:function(){

  }
}
console.log(greeting.myCall(obj, 1, 2, 3));