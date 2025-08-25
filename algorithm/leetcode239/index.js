/**
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @return {number[]} - 每个窗口的最大值数组
 */
var maxSlidingWindow = function (nums, k) {
    // 单调队列类：维护一个递减序列，队首始终是当前窗口的最大值
    class MonoQueue {
        queue;  // 内部队列数组
        
        constructor() {
            this.queue = [];  // 初始化空队列
        }
        
        // 入队操作：维护队列的单调递减性
        enqueue(value) {
            // 获取队列尾部元素
            let back = this.queue[this.queue.length - 1];
            
            // 循环移除所有小于当前值的尾部元素
            while (back !== undefined && back < value) {
                this.queue.pop();  // 移除尾部元素
                back = this.queue[this.queue.length - 1];  // 更新尾部元素
            }
            
            // 将当前值加入队列尾部
            this.queue.push(value);
        }
        
        // 出队操作：如果队首元素等于给定值，则移除
        dequeue(value) {
            let front = this.front();  // 获取队首元素
            
            // 只有当队首元素等于要移除的值时才出队
            if (front === value) {
                this.queue.shift();  // 移除队首元素
            }
        }
        
        // 获取队首元素（当前最大值）
        front() {
            return this.queue[0];
        }
    }
    
    // 初始化单调队列
    let helperQueue = new MonoQueue();
    
    // 双指针：i表示窗口起始位置，j表示窗口结束位置
    let i = 0, j = 0;
    
    // 结果数组：存储每个窗口的最大值
    let resArr = [];
    
    // 初始化第一个窗口
    while (j < k) {
        helperQueue.enqueue(nums[j++]);  // 将元素加入队列并移动j指针
    }
    
    // 记录第一个窗口的最大值
    resArr.push(helperQueue.front());
    
    // 滑动窗口：每次移动一个位置
    while (j < nums.length) {
        helperQueue.enqueue(nums[j]);    // 新元素入队
        helperQueue.dequeue(nums[i]);    // 旧元素出队（如果它是最大值）
        resArr.push(helperQueue.front()); // 记录当前窗口最大值
        i++, j++;                        // 移动窗口
    }
    
    // 返回所有窗口的最大值数组
    return resArr;
};


// 输入数组: [1, 3, -1, -3, 5, 3, 6, 7], k=3

// 窗口位置       单调队列(递减)       最大值
// [1  3  -1]    [3, -1]            3
// [3  -1  -3]   [3, -1, -3]        3  
// [-1 -3  5]    [5]                5
// [-3  5  3]    [5, 3]             5
// [5  3  6]     [6]                6
// [3  6  7]     [7]                7