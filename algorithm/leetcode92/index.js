/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {
    // 创建一个虚拟头节点，它的next指向链表的头节点
    let dummy = new ListNode(0, head);

    alert(111);
    // pre指针初始指向虚拟头节点
    let pre = dummy;
    // 将pre移动到第left-1个位置，即要反转部分的前一个节点
    for (let i = 0; i < left - 1; i++) {
        pre = pre.next;
    }
    // cur指针指向要反转部分的第一个节点（第left个节点）
    let cur = pre.next;
    // 进行right-left次反转操作
    for (let i = 0; i < right - left; i++) {
        // next指针指向当前节点的下一个节点
        let next = cur.next;
        // 将当前节点指向下下个节点，相当于跳过next节点
        cur.next = next.next;
        // 将next节点插入到反转部分的最前面，即让next指向pre的下一个节点
        next.next = pre.next;
        // 更新pre的next指向，使其指向新插入的节点（即next节点）
        pre.next = next;
    }
    // 返回虚拟头节点的下一个节点，即为整个链表的头节点
    return dummy.next;
};