function strAdd(str1,str2){
  // 1.实现类型转化
  let num1 = Number(str1)
  let num2 = Number(str2)
  const res = num1 + num2;
  return res;
}


console.log(strAdd('1','1'))
console.log(strAdd('11','99'))
console.log(strAdd('11','9999999999999999999999'))
