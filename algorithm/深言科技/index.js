function strAdd(str1,str2){
  // 1.实现类型转化
  let res = ""
  let i = str1.length - 1
  let j = str2.length - 1
  let curry = 0
  while(i >= 0 || j >=0){
    n1 = i >=0 ? parseInt(str1.charAt(i)) : "0"
    n2 = j >=0 ? parseInt(str2.charAt(j)) : "0"
    let temp = n1 + n2 + curry
    curry = Math.floor(temp /10)
    res += (temp % 10)
    i--;
    j--;
  }
  if(curry == 1) res += "1";

  return res.split("").reverse().join('')
}


console.log(strAdd('1','1'))
console.log(strAdd('11','99'))
console.log(strAdd('11','9999999999999999999999'))
