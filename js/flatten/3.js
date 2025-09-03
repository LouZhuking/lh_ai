// 栈模拟
function flatten(arr){
  // stack , 递归 LIFO
  const stack = [...arr];
  const res = [];
  while(stack.length){
    const item = stack.pop()
    if(Array.isArray(item)){
      stack.push(...item)
    }else{
      res.push(item)
    }
  }
  return res.reverse();
}
arr = [1,[1,2],[2,3,4]]
console.log(flatten(arr));
