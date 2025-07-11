/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    const n = nums.length
    if(n === 0){
      return -1
    }
    let left = 0, right = n - 1
    while(left + 1 < right){
      let mid = Math.floor((left+right)/2)
      if(nums[mid] < nums[right]){
        right = mid
      }else{
        left = mid
      }
    }
    let minIndex = nums[left] < nums[right] ? left : right
    nums = nums.slice(minIndex).concat(nums.slice(0, minIndex))
    left = 0, right = n - 1
    while(left + 1 < right){
      let mid = Math.floor((left+right)/2)
      if(nums[mid] < target){
        left = mid
      }else{
        right = mid
      }
    }
    return nums[left] === target ? left : nums[right] === target ? right : -1
};