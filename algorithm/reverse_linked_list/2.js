// 1->2->3->null 翻转
// head 3
// 2 2.next 3 3.next = 2 head
function reverseListRecursive(head){
  // 递归结束条件
  if(!head || !head.next){
    return next;
  }

  // 递归调用 交给下一个
  // 回溯？ 
  const newHead = reverseListRecursive(head.next)
  head.next.next = head;
  head.next = null;
  return newHead;
}