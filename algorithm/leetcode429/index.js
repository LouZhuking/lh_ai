var levelOrder = function(root) {
    // 初始化结果数组，用于存储每一层的节点值
    let res = [];
    // 初始化队列，用于BFS（广度优先搜索）遍历，存放待处理的节点
    let queue = [];

    // 将根节点加入队列，开始遍历
    // 注意：如果根节点为空（null），则不会进入后续循环
    queue.push(root);

    // 当队列不为空 且 根节点不为null时，继续遍历
    // 这里的 root !== null 判断其实可以在前面处理，但这样写也能保证逻辑正确
    while (queue.length && root !== null) {
        // 记录当前层的节点数量
        // 这个长度是进入当前层循环时队列的长度，即当前层所有节点的数量
        let length = queue.length;

        // 用于存放当前层所有节点的值
        let curLevel = [];

        // 循环处理当前层的所有节点
        // length-- 控制只处理当前层的节点，不包括本层处理过程中加入的下一层节点
        while (length--) {
            // 从队列头部取出一个节点（先进先出）
            let node = queue.shift();

            // 将该节点的值加入当前层的结果数组
            curLevel.push(node.val);

            // 遍历该节点的所有子节点（N叉树的关键）
            // node.children 是一个数组，包含所有子节点
            for (let item of node.children) {
                // 如果子节点存在（非null），则加入队列，等待下一层处理
                // 这里 item && 是为了防止 null 或 undefined 节点被加入
                item && queue.push(item);
            }
        }

        // 当前层的所有节点处理完毕，将该层的结果加入最终结果数组
        res.push(curLevel);
    }

    // 返回最终的层序遍历结果，是一个二维数组
    // 每一个子数组代表一层的节点值
    return res;
};