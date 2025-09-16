/**
 * @param {TreeNode} root - 二叉树的根节点
 * @return {number} - 返回二叉树的最大深度（整数）
 */
var maxDepth = function(root) {
    // 定义一个内部递归函数 getdepth，用于计算以 node 为根的子树的最大深度
    const getdepth = function(node) {
        // 基础情况：如果当前节点为空（null），说明到达叶子节点下方，深度为 0
        if (node === null) {
            return 0;
        }

        // 递归计算左子树的最大深度
        let leftdepth = getdepth(node.left);

        // 递归计算右子树的最大深度
        let rightdepth = getdepth(node.right);

        // 当前节点的深度 = 左右子树中较大的深度 + 1（+1 表示当前节点本身）
        let depth = 1 + Math.max(leftdepth, rightdepth);

        // 返回当前子树的最大深度
        return depth;
    };

    // 调用递归函数，从根节点开始计算整棵树的最大深度
    return getdepth(root);
};