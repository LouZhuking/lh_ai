/**
 * Definition for a binary tree node.
 * 定义二叉树节点的构造函数
 */
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)  // 节点的值，默认为0
    this.left = (left===undefined ? null : left)  // 左子节点，默认为null
    this.right = (right===undefined ? null : right)  // 右子节点，默认为null
}

/**
 * @param {TreeNode} root  // 参数类型注解：二叉树的根节点
 * @return {number[]}  // 返回值类型注解：包含节点值的数组
 */
var preorderTraversal = function(root) {
    let res = [];  // 创建一个空数组，用于存储遍历结果
    
    // 定义深度优先搜索(DFS)的递归函数
    const dfs = function(root){
        if(root === null) return;  // 递归终止条件：如果节点为空，直接返回
        res.push(root.val);  // 访问根节点，将节点值添加到结果数组
        dfs(root.left);  // 递归遍历左子树
        dfs(root.right);  // 递归遍历右子树
    }
    
    dfs(root);  // 调用递归函数，从根节点开始遍历
    return res;  // 返回最终的遍历结果数组
};


var preorderTraversal = function(root, res = []) {
    if(!root) return res;
    const stack = [root];
    let cur = null;
    while(stack.length) {
        cur = stack.pop();
        res.push(cur.val);
        cur.right && stack.push(cur.right);
        cur.left && stack.push(cur.left);
    }
    return res;
};