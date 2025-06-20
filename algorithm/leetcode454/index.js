/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number[]} nums3
 * @param {number[]} nums4
 * @return {number}
 */
var fourSumCount = function(nums1, nums2, nums3, nums4) {
  // 创建哈希表存储nums1和nums2所有可能和的出现次数
  const countAB = new Map()
  
  // 嵌套遍历nums1和nums2，计算所有两数之和并统计频次
  // 时间复杂度O(n²)，n为nums1/nums2的平均长度
  nums1.forEach(u => nums2.forEach(v => {
    const sum = u + v
    // 若sum已存在则频次+1，否则初始化为1
    countAB.set(sum, (countAB.get(sum) || 0) + 1)
  }));
  
  // 初始化结果计数器
  let ans = 0;
  
  // 嵌套遍历nums3和nums4，寻找满足条件的互补和
  nums3.forEach(u => nums4.forEach(v => {
    // 计算目标互补和：-(u + v)，即需要a + b = -(c + d)
    const target = -u - v
    // 若互补和存在于哈希表中，则累加其出现次数
    ans += countAB.get(target) || 0
  }));
  
  // 返回满足条件的元组总数
  return ans;
};