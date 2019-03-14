function twosumFn() {
	/*给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。
	你可以假设每个输入只对应一种答案，且同样的元素不能被重复利用。
	*/
	/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
	var twoSum = function (nums, target) {
		for (let n = 0; n < nums.length; n++) {
			const ele = nums[n];
			for (let i = n + 1; i < nums.length; i++) {
				const ele2 = nums[i];
				const sums = ele + ele2;
				if (sums === target) {
					return [n, i];
				}
			}
		}
	};
	var nums = [3, 4, 2, 5, 4],
		target = 8;
	twoSum(nums, target);
}
function threesumFn() {
	// 获取指定数组中三数相加的等于0的所有元素 且元素内容不能一样
	/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
	var threeSum = function (nums) {
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
					start++
				} else if (sums > ele) {
					end--
				} else {
					arr.push([nums[n], nums[start], nums[end]]);
					while (nums[start] === nums[start + 1]) {
						start++
					}
					start++
					while (nums[end] === nums[end - 1]) {
						end--
					}
					end--
				}
			}
		}
		return arr;
	};
	var nums = [-1, 0, 1, 2, -1, -4, -2, 3];
	threeSum(nums);
}
threesumFn();