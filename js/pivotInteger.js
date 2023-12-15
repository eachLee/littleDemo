/**
 * @param {number} n
 * @return {number}
 */
var pivotInteger = function (n) {
	if (n === 1) {
		return 1
	}
	function countPivot(index) {
		let pivot = index;
		let prev = 0;
		let next = 0;
		for (let x = 1; x <= pivot; x++) {
			prev += x
		}
		for (let x = pivot; x <= n; x++) {
			next += x
		}
		if (prev === next) {
			return pivot
		} else if (index >= n) {
			return -1
		} else {
			return countPivot(index + 1)
		}
	}
	let pivotInt = countPivot(Number.parseInt(n / 2))
	return pivotInt

};
pivotInteger(8)

function fun(n) {
	let num = 0;
	let num1 = 0; // 初始化 num1
	let num2 = 0; // 初始化 num2
	for (let i = 0; i < n; i += 1) {
		num1 += i; // 将 num1 累加
		num2 = 0;
		for (let k = i; k <= n; k++) {
			num2 += k;
		}
		if (num1 === num2) {
			num = i;
		}
	}
	return num || -1;
}
console.log(fun(8));


function findCenteredInteger(n) {
	let leftSum = 0;
	let rightSum = 0;

	for (let i = 1; i <= n; i++) {
		rightSum += i;
	}

	for (let i = 1; i <= n; i++) {
		rightSum -= i;
		if (leftSum === rightSum) {
			return i;
		}
		leftSum += i;
	}

	return -1;
}
console.log(findCenteredInteger(4));