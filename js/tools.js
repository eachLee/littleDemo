var toolsObj = function() {};

toolsObj.prototype = {
	// 获取指定范围的随机数 返回整数 包含min和max值
	getRandomNum: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	// 获取url里的参数值 并返回一个包含对应参数相应的object对象 url 为指定网址
	getUrlParam: function(url) {
		var urlArr = [],
			urlObj = {};
		if (url.indexOf('?') > -1) {
			urlArr = url.split('?');
			if (urlArr[1].indexOf('&') > -1) {
				urlArr = urlArr[1].split('&');
				for (var i = 0; i < urlArr.length; i++) {
					var ele = urlArr[i];
					var eleArr = [];
					if (ele.indexOf('=') > -1) {
						eleArr = ele.split('=');
						urlObj[eleArr[0]] = eleArr[1];
					}
				}
				return urlObj;
			}
		}
		return undefined;
	},

	// 复制指定文本到剪切板上 参数为要复制的文本
	copyText: function(text) {
		var copyBox = document.createElement('input');
		copyBox.value = text;
		document.body.appendChild(copyBox);
		copyBox.select();
		document.execCommand('copy');
		copyBox.style.display = 'none';
		copyBox.remove();
	},

	// 深复制对象 返回复制的对象
	deelClone: function(obj) {
		if (!obj) return;
		// 一个检测传入的对象是否是指定类型的函数 返回boolean
		function isType(obj, type) {
			if (typeof obj !== 'object') return false;
			var objType = Object.prototype.toString.call(obj).toLowerCase();
			var flag = false;
			switch (type) {
				case 'array':
					flag = objType === '[object array]';
					break;
				case 'date':
					flag = objType === '[object date]';
					break;
				case 'regexp':
					flag = objType === '[object regexp]';
					break;
				default:
					flag = false;
			}
			return flag;
		}
		// 获取regexp的参数 返回参数值
		function getRegexp(reg) {
			var flags = '';
			if (reg.global) flags += 'g';
			if (reg.ignoreCase) flags += 'i';
			if (reg.multiline) flags += 'm';
			return flags;
		}
		//维护两个储存循环引用的数组
		var parents = [];
		var children = [];
		function cloneObj(obj) {
			var child, proto;
			if (typeof obj === 'function') return obj;
			if (typeof obj !== 'object') return obj;
			if (isType(obj, 'array')) {
				// 对数组做特殊处理
				child = [];
			} else if (isType(obj, 'regexp')) {
				// 对正则对象做特殊处理
				child = new RegExp(obj.source, getRegexp(obj));
				if (parent.lastIndex) child.lastIndex = parent.lastIndex;
			} else if (isType(obj, 'date')) {
				// 对时间对象做特殊处理
				child = new Date(obj.getTime());
			} else {
				// 处理对象原型
				proto = Object.getPrototypeOf(obj);
				// 利用Object.create切断原型链
				child = Object.create(proto);
			}

			// 处理循环引用
			var index = parents.indexOf(children);
			if (index > -1) {
				// 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
				return children[index];
			}
			parents.push(obj);
			children.push(child);
			//  对对象做特殊处理
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					// 递归调用
					child[key] = cloneObj(obj[key]);
				}
			}
			return child;
		}
		return cloneObj(obj);
	}
};
var tools = new toolsObj();
