/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
	const stack = [];
	const bracketPairs = {
		'(': ')',
		'[': ']',
		'{': '}'
	};

	for (let i = 0; i < s.length; i++) {
		const char = s.charAt(i);
		if (bracketPairs[char]) {
			stack.push(char); // 左括号入栈
		} else {
			// 右括号，检查栈顶元素是否匹配
			const top = stack.pop();
			if (bracketPairs[top] !== char) {
				return false; // 不匹配
			}
		}
	}

	return stack.length === 0; // 栈为空则全部匹配
};
isValid('[(')

function isValid(s) {
	const stack = [];
	for (let i = 0; i < s.length; i++) {
		const char = s[i];
		switch (char) {
			case "{":
				stack.push("}");
				break;
			case "[":
				stack.push("]");
				break;
			case "(":
				stack.push(")");
				break;
			default:
				// 右括号，检查栈顶元素是否匹配
				const top = stack.pop();
				if (top !== char) {
					return false; // 不匹配
				}
				break;
		}
	}
	return stack.length === 0; // 栈为空则全部匹配
}

// 示例用法：
console.log(isValid("()")); // 输出 true
console.log(isValid("()[]{}")); // 输出 true
console.log(isValid("(]")); // 输出 false
