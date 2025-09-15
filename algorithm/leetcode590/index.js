/**
 * // Definition for a _Node.
 * function _Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number[]}
 */
var postorder = function(root) {
    // 存储遍历结果的数组
    let res = [];
    
    // 定义深度优先搜索函数
    const dfs = function(node){
        // 如果节点为空，直接返回
        if(node === null) return;
        
        // 先递归遍历所有子节点（从左到右）
        if (node.children) {
            for (let child of node.children) {
                dfs(child);  // 递归处理每个子节点
            }
        }
        
        // 最后访问当前节点的值（后序遍历特点）
        res.push(node.val);
    }
    
    // 从根节点开始遍历
    dfs(root);
    
    // 返回遍历结果
    return res;
};