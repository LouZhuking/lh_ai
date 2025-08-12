/**
 * 扩展运算符应用
 */

function push(array,...items){
  array.push(...items)
}

const arr = [1,2,3]
push(arr,4,5,6)
console.log(arr);
// [1, 2, 3, 4, 5, 6]



function add(a,b){
  return a + b;
}

const numbers = [10,27]
add(...numbers)
console.log(add(...numbers));

