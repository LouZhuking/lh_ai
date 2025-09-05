/**
 * @param {number[]} nums  输入的数字数组，比如[100,4,200,1,3,2]
 * @return {number}        返回最长连续数字序列的长度
 */
var longestConsecutive = function(nums) {
    // 1. 创建一个Set集合，自动去重，避免重复数字干扰
    let num_set = new Set();
    
    // 2. 把所有数字都放进集合里，就像把所有数字放进一个"魔法盒子"
    for(const num of nums){
        num_set.add(num)
    }
    
    // 3. 记录最长连续序列的长度，初始为0
    let longestStreak = 0;
    
    // 4. 遍历集合中的每一个数字
    for(const num of num_set){
        // 5. 关键！只从"序列起点"开始找
        // 如果num-1不存在，说明num可能是一个新序列的起点
        if(!num_set.has(num-1)){
            let currentNum = num;      // 当前数字
            let currentStreak = 1;     // 当前连续序列长度，从1开始
            
            // 6. 向后找连续的下一个数字
            // 比如当前是1，看有没有2、3、4...
            while(num_set.has(currentNum + 1)){
                currentNum += 1;         // 数字+1
                currentStreak += 1;      // 序列长度+1
            }
            
            // 7. 更新最长序列记录
            longestStreak = Math.max(longestStreak, currentStreak)
        }
    }
    
    // 8. 返回找到的最长连续序列长度
    return longestStreak;
};