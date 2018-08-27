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
		let arr = [];
		for (let n = 0; n < nums.length; n++) {
			const ele = nums[n];
			for (let i = n + 1; i < nums.length; i++) {
				const ele2 = nums[i];
				for (let m = i + 1; m < nums.length; m++) {
					const ele3 = nums[m];
					const sums = ele + ele2 + ele3;
					let canPush = true;
					if (sums === 0) {
						for (var s = 0; s < arr.length; s++) {
							const ele4 = arr[s].sort();
							const elearr = [ele, ele2, ele3].sort();
							if (ele4 && (elearr[0] === ele4[0] && elearr[1] === ele4[1] && elearr[2] === ele4[2])) {
								canPush = false;
							}
						}

						if (canPush) {
							arr.push([ele, ele2, ele3]);
							canPush = true;
						}
					}
				}
			}
		}
		console.log(arr);
		return arr;
	};
	var nums = [-1, 0, 1, 2, -1, -4, -2, 3];
	threeSum(nums);
}
threesumFn();