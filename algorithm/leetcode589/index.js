/**
 * // Definition for a _Node.
 * function _Node(val, children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number[]}
 */
var preorder = function(root) {
    let res = [];
    const dfs = function(root){
        if(root === null) return;
        res.push(root.val);
        if(node.children){
          for(let child of node.children){
            dfs(child);
          }
        }
    }
    dfs(root);
    console.log(res);
    
    return res;
};
