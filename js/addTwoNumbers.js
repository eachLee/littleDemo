/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
// 理解错误 链表不是数组 不可迭代 故解法作废
var addTwoNumbers = function (l1, l2) {
	let l3 = (l1.reverse().join('') / 1 + l2.reverse().join('') / 1) + '';
	return l3.split('').map(item => item / 1).reverse()
};
addTwoNumbers([2, 4, 3], [5, 6, 4])