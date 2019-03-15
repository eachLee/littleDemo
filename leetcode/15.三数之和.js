/*
 * @lc app=leetcode.cn id=15 lang=javascript
 *
 * [15] 三数之和
 *
 * https://leetcode-cn.com/problems/3sum/description/
 *
 * algorithms
 * Medium (21.23%)
 * Total Accepted:    40.4K
 * Total Submissions: 188.7K
 * Testcase Example:  '[-1,0,1,2,-1,-4]'
 *
 * 给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0
 * ？找出所有满足条件且不重复的三元组。
 * 
 * 注意：答案中不可以包含重复的三元组。
 * 
 * 例如, 给定数组 nums = [-1, 0, 1, 2, -1, -4]，
 * 
 * 满足要求的三元组集合为：
 * [
 * ⁠ [-1, 0, 1],
 * ⁠ [-1, -1, 2]
 * ]
 * 
 * 
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
	nums.sort(function (a, b) {
		return a - b;
	});
	let arr = [];
	var len = nums.length;
	for (let n = 0; n < len; n++) {
		if (n && nums[n] === nums[n - 1]) continue;
		const ele = -nums[n];
		let [start, end] = [n + 1, len - 1];
		while (start < end) {
			let sums = nums[start] + nums[end];
			if (sums < ele) {
				start++;
			} else if (sums > ele) {
				end--;
			} else {
				arr.push([nums[n], nums[start], nums[end]]);
				while (nums[start] === nums[start + 1]) {
					start++;
				}
				start++;
				while (nums[end] === nums[end - 1]) {
					end--;
				}
				end--;
			}
		}
	}
	return arr;
};

