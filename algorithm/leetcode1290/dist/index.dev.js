"use strict";

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode} head
 * @return {number}
 */
var getDecimalValue = function getDecimalValue(head) {
  if (head == null) {
    return 0;
  }

  var cur = head;
  var ans = 0;

  while (cur !== null) {
    ans = ans * 2 + cur.val;
    cur = cur.next;
  }

  return ans;
};