/***
 * 
 *@param {number} total
 *@param {number} num
 *@return {number[]}
 *  
 */

function hongbao(total,num){
  const arr = [];
  let restAmount = total; // 剩余金额
  let restNum = num; // 剩余个数

  for(let i = 0; i < num - 1; i++){
    // Math 
    // 包装类
    let amount = Math.random(restAmount / restNum *2).toFixed(2); // 随机金额
    // console.log(amount);
    restAmount -= amount; // 剩余金额
    restNum--; // 剩余个数
    arr.push(amount); // 放入数组
    arr.push(amount);
    
  }
  arr.push(restAmount.toFixed(2)); // 放入数组
  // - 公平性
  // 平均值
  // 随机性

  return arr;
}
console.log(hongbao(31,31));

