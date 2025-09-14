/**
 * 二叉树的右视图
 * 给定一个二叉树的根节点 root，从右侧看该二叉树，返回你能看到的所有节点值（从上到下）
 * 核心思路：从右侧看过去，看到的是每一层的最右边的节点
 * 使用层序遍历（广度优先搜索），每层遍历时，将最后一个节点的值加入结果数组
 * 
 * @param {TreeNode} root - 二叉树的根节点
 * @return {number[]} - 从右往左看到的节点值组成的数组
 */
var rightSideView = function(root) {
    // 初始化结果数组，用于存储每一层最右边节点的值
    let res = [];
    // 初始化队列，用于层序遍历，存储当前层的所有节点
    let queue = [];
    
    // 将根节点加入队列，开始层序遍历
    // 如果根节点为空（null），则不会进入循环
    queue.push(root);

    // 当队列不为空且根节点不为null时，持续进行层序遍历
    // 注意：这里 root !== null 的判断在第一次循环时有效，但后续循环中 root 不会改变，实际主要靠 queue.length 控制循环
    while(queue.length && root !== null) {
        // 记录当前层的节点数量
        // 这个数量决定了当前层需要处理多少个节点
        let length = queue.length;
        
        // 使用 while 循环处理当前层的所有节点
        // length 会逐次减1，直到为0，表示当前层处理完毕
        while(length--) {
            // 从队列头部取出一个节点进行处理（先进先出）
            let node = queue.shift();
            
            // 当 length 为 0 时，说明当前节点是这一层的最后一个节点
            // 即从右边能看到的节点，将其值加入结果数组
            if(!length) {
                res.push(node.val);
            }
            
            // 如果当前节点有左子节点，将其加入队列，供下一层遍历时使用
            node.left && queue.push(node.left);
            
            // 如果当前节点有右子节点，将其加入队列，供下一层遍历时使用
            node.right && queue.push(node.right);
        }
    }

    // 返回最终的右视图结果
    return res;
};