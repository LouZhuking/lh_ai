/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
  // 定义数组的长度防止多次复用
  const n = height.length;
  // 定义前缀最大值的数组
  const pre_max = new Array(n).fill(0);
  // 定义后缀最大值的数组
  const suf_max = new Array(n).fill(0);
  pre_max[0] = height[0];
  suf_max[n-1] = height[n-1];
  // 判断前缀数组当中元素与块状高度取最大值
  for(let i =1;i<=n;i++){
    pre_max[i] = Math.max(pre_max[i-1],height[i]);
  }
  // 判断后缀数组当中元素与块状高度取最大值
  for(let i = n-2;i>=0;i--){
    suf_max[i] = Math.max(suf_max[i+1],height[i])
  }
  // 判断同数组元素下per_max和suf_max的最小值减去height[i]
  let ans = 0;
  for(let i = 0; i<n;i++){
    ans += Math.min(pre_max[i],suf_max[i])-height[i];
  }
  return ans;
};
