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
	}
};
var tools = new toolsObj();
