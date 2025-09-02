/**
 * 计算字符串中最长无重复字符子串的长度
 * @param {string} s - 输入的字符串
 * @return {number} - 最长无重复子串的长度
 */
var lengthOfLongestSubstring = function (s) {
    // 创建一个Set集合，用来存储当前窗口中的字符（自动去重）
    const occ = new Set();
    
    // 获取字符串的长度，避免多次计算
    const n = s.length;
    
    // rk: 右指针，表示当前子串的右边界（初始为-1，表示还没开始）
    // ans: 最终答案，记录最长子串长度
    let rk = -1, ans = 0;
    
    // 🎯 主循环：i是左指针，表示当前子串的左边界
    for (let i = 0; i < n; ++i) {
        
        // 如果不是第一个字符，需要移除左指针左边那个字符
        // 因为窗口要向右移动了
        if (i != 0) {
            // 删除左边界左边的字符（窗口左移）
            occ.delete(s.charAt(i - 1));
        }
        
        // 🎯 内层循环：扩展右边界，直到遇到重复字符
        // 条件1: rk+1 < n 保证不越界
        // 条件2: !occ.has(s.charAt(rk+1)) 保证字符不重复
        while (rk + 1 < n && !occ.has(s.charAt(rk + 1))) {
            // 把新字符加入集合
            occ.add(s.charAt(rk + 1));
            // 右指针右移，扩展窗口
            rk++;
        }
        
        // 计算当前窗口长度，并更新最大值
        // rk - i + 1 = 右边界 - 左边界 + 1 = 当前子串长度
        ans = Math.max(ans, rk - i + 1);
    }
    
    // 返回最终的最长无重复子串长度
    return ans;
};