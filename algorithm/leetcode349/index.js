/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
// 定义求两个Set交集的函数
const set_intersection = (set1, set2) => {
  // 优化：总是遍历较小的Set以提高性能
  if (set1.size > set2.size) {
      return set_intersection(set2, set1);
  }
  
  // 创建新Set存储交集结果
  const intersection = new Set();
  
  // 遍历set1中的每个元素
  for (const num of set1) {
      // 检查当前元素是否存在于set2中
      if (set2.has(num)) {
          // 如果存在则添加到交集Set中
          intersection.add(num);
      }
  }
  
  // 将Set转为数组返回
  return [...intersection];
}

// 主函数：求两个数组的交集
var intersection = function(nums1, nums2) {
  // 将数组转为Set去重
  const set1 = new Set(nums1);
  const set2 = new Set(nums2);
  
  // 调用set_intersection函数求交集
  return set_intersection(set1, set2);
};

