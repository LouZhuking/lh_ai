/**
 * @param {string} s
 * @return {string}
 */
let s = "the sky is blue"
var reverseWords = function(s) {
  // 1.先将字符串转为数组
  const strArr = Array.from(s);
  // 2. 删除多余空行
  removeExtraSpaces(strArr)
  //  3. 反转数组
  reverse(strArr, 0, strArr.length - 1)
  //  4. 反转单词
  let start = 0;

  for(let i =0; i <=strArr.length; i++){
      if(strArr[i] === ' ' || i === strArr.length){
          reverse(strArr,start,i-1);
          start = i + 1;
          console.log(strArr)
        }

  }


  return strArr.join('');
};

// 移除数组中多余空格
function removeExtraSpaces(strArr){
  let slowIndex = 0;
  let fastIndex = 0;
  
  // 删除开始位置和重复的空行
  while(fastIndex < strArr.length){
      if(strArr[fastIndex] === ' ' && (fastIndex === 0 || strArr[fastIndex-1] === ' ')){
          fastIndex++;
      }else{
          strArr[slowIndex] = strArr[fastIndex];
          slowIndex++;
          fastIndex++;
      }
  }
  // 删除末尾空行
  strArr.length = strArr[slowIndex - 1] === ' ' ? slowIndex - 1 : slowIndex;

}

// 反转 从 start 到 end 的单词
function reverse(strArr, start, end){
  let left = start;
  let right = end;
  while(left < right){
      [strArr[left],strArr[right]] = [strArr[right], strArr[left]];
      left++;
      right--;
  }

}

console.log(reverseWords(s))