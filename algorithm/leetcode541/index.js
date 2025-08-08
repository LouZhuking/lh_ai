/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var reverseStr = function(s, k) {
    // 1. 拿到数组字符串的长度
    const len = s.length;
    // 2. 将交换的数据存储起来
    let resArr = s.split("");
    //  3. 开始循环遍历数组当中以2k开始遍历
    for (let i = 0; i < len; i += 2*k){
        // 4. 判断交换条件确定交换函数的左指针位置

        let l = i -1 , r = i + k > len ? len : i + k;
        // console.log(l,r);

        
        while(++l< --r){
            [resArr[l],resArr[r]] = [resArr[r],resArr[l]]
        }
    }
    // 5. 最后将数组转换为字符串返回
    return resArr.join("");

};

console.log(reverseStr("abcdefg", 2));

