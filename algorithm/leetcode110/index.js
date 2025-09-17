/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val === undefined ? 0 : val)
 *     this.left = (left === undefined ? null : left)
 *     this.right = (right === undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function(root) {
    // 定义一个辅助函数 getDepth，用于计算节点的深度，并在不平衡时返回 -1 表示“失败”
    const getDepth = function(node) {
        // 如果当前节点为空（叶子节点的子节点），深度为 0
        if (node === null) return 0;

        // 递归获取左子树的深度
        let leftDepth = getDepth(node.left);

        // 如果左子树已经不平衡（返回了 -1），直接向上返回 -1，不再继续计算
        if (leftDepth === -1) return -1;

        // 递归获取右子树的深度
        let rightDepth = getDepth(node.right);

        // 如果右子树已经不平衡（返回了 -1），直接向上返回 -1
        if (rightDepth === -1) return -1;

        // 检查当前节点左右子树的深度差是否超过 1
        if (Math.abs(leftDepth - rightDepth) > 1) {
            // 如果超过 1，说明以当前节点为根的子树不平衡，返回 -1 标记“不平衡”
            return -1;
        } else {
            // 否则，当前子树是平衡的，返回该节点的实际深度（1 + 子树最大深度）
            return 1 + Math.max(leftDepth, rightDepth);
        }
    };

    // 调用 getDepth 遍历整棵树
    // 如果最终结果不是 -1，说明整棵树都平衡，返回 true；否则返回 false
    return !(getDepth(root) === -1);
};