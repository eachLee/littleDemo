{
	let sendData = {},
		devicesInfo;

	// 根据元素读取xPath
	function readXPath(element) {
		if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
			return '//*[@id="' + element.id + '"]';
		}
		//这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
		if (element == document.body) {//递归到body处，结束递归
			return '/html/' + element.tagName.toLowerCase();
		}
		var ix = 1,//在nodelist中的位置，且每次点击初始化
			siblings = element.parentNode != null ? element.parentNode.childNodes : element;//同级的子元素
		for (var i = 0, l = siblings.length; i < l; i++) {
			var sibling = siblings[i];
			var slis = sibling.parentNode.children;
			var k = 0;
			//如果同类标签有多个时则显示下标
			for (var j = 0; j < slis.length; j++) {
				if (slis[j].nodeName == sibling.nodeName) {
					k++;
				}
			}
			if (k == 1) {
				return readXPath(element.parentNode) + '/' + element.tagName.toLowerCase();
			}
			//如果这个元素是siblings数组中的元素，则执行递归操作
			if (sibling == element) {
				return readXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
				//如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
			} else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
				ix++;
			}
		}
	}
	function getAttrList(element) {
		var arr = [],
			attrName,
			attrValue,
			i,
			len,
			attrs = element.attributes;

		for (i = 0, len = attrs.length; i < len; i++) {
			attrName = attrs[i]['nodeName'];
			attrValue = attrs[i]['nodeValue'];
			if (attrs[i]['specified'] && attrs[i].name.toLowerCase().indexOf("monitor-") != -1) {
				arr.push(attrName + "=\"" + attrValue + "\"");
			}
		}

		return arr.join(' ');
	}
	//页面加载埋点
	function pageLoad() {
		sendData.uploadType = 'CUSTOMER_PV';
		sendData.loadType = 'load';
		sendData.loadTime = "0";
		sendData.title = document.title;
		devicesInfo = getDevice();
		setCommonProperty()
		return sendData;
	}
	function clickElement(e) {
		//处理事件对象不存在的情况
		if (!e.target) {
			if (e.$el) {
				e.target = e.$el
			} else {
				e.target = document.body
			}
		}
		//密码框不上传
		if (e.target.nodeName.toLowerCase() !== 'svg' && e.target.nodeName.toLowerCase() !== 'use') {
			if ((e.target.type && e.target.type == 'password') ||
				(e.target.className && e.target.className.indexOf('unmonitor') > -1)) {
				return;
			}
		}
		var className = "";
		var placeholder = "";
		var inputValue = "";
		var tagName = e.target.tagName;
		var tagType = e.target.type || '';
		var innerText = "";
		var sourceId = "";
		var xpath = "";
		var attributeName = ""
		if (e.target.tagName.toLowerCase() != "svg" && e.target.tagName.toLowerCase() != "use") {
			xpath = readXPath(e.target);
			className = (typeof e.target.className === 'object') ? e.target.className.baseVal : e.target.className;
			sourceId = e.target.id;
			placeholder = e.target.placeholder || "";
			inputValue = e.target.value || "";
			innerText = e.target.innerText ? e.target.innerText.replace(/\s*/g, "") : "";
			// 如果点击的内容过长，就截取上传
			if (innerText.length > 200) innerText = innerText.substring(0, 100) + "... ..." + innerText.substring(innerText.length - 99, innerText.length - 1);
			innerText = innerText.replace(/\s/g, '').replace(/\\/g, "/").replace(/\"/g, '');
			if (inputValue.length > 200) inputValue = inputValue.substring(0, 100) + "... ..." + inputValue.substring(inputValue.length - 99, inputValue.length - 1);
			inputValue = inputValue.replace(/\s/g, '').replace(/\\/g, "/").replace(/\"/g, '');
			attributeName = getAttrList(e.target);
			if (attributeName.length > 50) attributeName = attributeName.substring(0, 50)
		}
		// if ((innerText == '' && inputValue == '') || innerText.length > 10) {
		//    return;
		// }
		sendData.uploadType = 'ELE_BEHAVIOR';
		sendData.behaviorType = 'click';
		sendData.sourceId = sourceId
		sendData.className = (className);
		sendData.placeholder = (placeholder);
		sendData.inputValue = (inputValue);
		sendData.tagName = tagName;
		sendData.tagType = tagType
		sendData.innerText = innerText;
		sendData.xpath = xpath;
		sendData.attributeName = attributeName;
		devicesInfo = getDevice();
		setCommonProperty()
		return sendData;
	}
	function getDevice() {
		var device = {};
		var ua = navigator.userAgent;
		var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
		var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
		var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
		var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
		var mobileInfo = ua.match(/Android\s[\S\s]+Build\//);
		device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
		device.isWeixin = /MicroMessenger/i.test(ua);
		device.os = "web";
		device.deviceName = "PC";
		var userAgent = ua.toLowerCase();
		if (userAgent.indexOf('win') > -1) {
			var name = "";
			if (userAgent.indexOf('windows nt 5.0') > -1) {
				name = 'Windows 2000';
			} else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
				name = 'Windows XP';
			} else if (userAgent.indexOf('windows nt 6.0') > -1) {
				name = 'Windows Vista';
			} else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
				name = 'Windows 7';
			} else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
				name = 'Windows 8';
			} else if (userAgent.indexOf('windows nt 6.3') > -1) {
				name = 'Windows 8.1';
			} else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
				name = 'Windows 10';
			} else {
				name = 'Unknown';
			}
			device.os = name;
		}
		// Android
		if (android) {
			device.os = 'android';
			device.osVersion = android[2];
			device.android = true;
			device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
		}
		if (ipad || iphone || ipod) {
			device.os = 'ios';
			device.ios = true;
		}
		// iOS
		if (iphone && !ipod) {
			device.osVersion = iphone[2].replace(/_/g, '.');
			device.iphone = true;
		}
		if (ipad) {
			device.osVersion = ipad[2].replace(/_/g, '.');
			device.ipad = true;
		}
		if (ipod) {
			device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
			device.iphone = true;
		}
		// iOS 8+ changed UA
		if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
			if (device.osVersion.split('.')[0] === '10') {
				device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
			}
		}

		// 如果是ios, deviceName 就设置为iphone，根据分辨率区别型号
		if (device.iphone) {
			device.deviceName = "iphone";
			var screenWidth = window.screen.width;
			var screenHeight = window.screen.height;
			if (screenWidth === 320 && screenHeight === 480) {
				device.deviceName = "iphone 4";
			} else if (screenWidth === 320 && screenHeight === 568) {
				device.deviceName = "iphone 5/SE";
			} else if (screenWidth === 375 && screenHeight === 667) {
				device.deviceName = "iphone 6/7/8";
			} else if (screenWidth === 414 && screenHeight === 736) {
				device.deviceName = "iphone 6/7/8 Plus";
			} else if (screenWidth === 375 && screenHeight === 812) {
				device.deviceName = "iphone X/S/Max";
			}
		} else if (device.ipad) {
			device.deviceName = "ipad";
		} else if (mobileInfo) {
			var info = mobileInfo[0];
			var deviceName = info.split(';')[1].replace(/Build\//g, "");
			device.deviceName = deviceName.replace(/(^\s*)|(\s*$)/g, "");
		}
		// 浏览器模式, 获取浏览器信息
		// TODO 需要补充更多的浏览器类型进来
		if (ua.indexOf("Mobile") == -1) {
			var agent = navigator.userAgent.toLowerCase();
			var regStr_ie = /msie [\d.]+;/gi;
			var regStr_ff = /firefox\/[\d.]+/gi
			var regStr_chrome = /chrome\/[\d.]+/gi;
			var regStr_saf = /safari\/[\d.]+/gi;

			device.browserName = '未知';
			//IE
			if (agent.indexOf("msie") > 0) {
				var browserInfo = agent.match(regStr_ie)[0];
				device.browserName = browserInfo.split('/')[0];
				device.browserVersion = browserInfo.split('/')[1];
			}
			//firefox
			if (agent.indexOf("firefox") > 0) {
				var browserInfo = agent.match(regStr_ff)[0];
				device.browserName = browserInfo.split('/')[0];
				device.browserVersion = browserInfo.split('/')[1];
			}
			//Safari
			if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
				var browserInfo = agent.match(regStr_saf)[0];
				device.browserName = browserInfo.split('/')[0];
				device.browserVersion = browserInfo.split('/')[1];
			}
			//Chrome
			if (agent.indexOf("chrome") > 0) {
				var browserInfo = agent.match(regStr_chrome)[0];
				device.browserName = browserInfo.split('/')[0];
				device.browserVersion = browserInfo.split('/')[1];
			}
		}
		// Webview
		device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

		// Export object
		return device;
	}
	function dateFormat(date, fmt) {
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};
	function getUuid() {
		var timeStamp = new Date().getTime()
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		}) + "-" + timeStamp;
	};
	function getCustomerKey() {
		var customerKey = getUuid();
		var reg = /^[0-9a-z]{8}(-[0-9a-z]{4}){3}-[0-9a-z]{12}-\d{13}$/
		if (!localStorage.monitorCustomerKey) {
			localStorage.monitorCustomerKey = customerKey;
		} else if (!reg.test(localStorage.monitorCustomerKey)) {
			localStorage.monitorCustomerKey = customerKey;
		}
		return localStorage.monitorCustomerKey;
	};
	// 设置日志对象类的通用属性
	function setCommonProperty() {
		sendData.happenTime = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'); // 日志发生时间
		sendData.webMonitorId = '0b0910cc-1f61-4ea8-8f21-ddc71829fe73';     // 用于区分应用的唯一标识（一个项目对应一个）
		//this.uri = window.location.href.split('?')[0].replace('#', ''); // 页面的url
		sendData.uri = window.location.pathname[0] == "/" ? window.location.pathname.slice(1) : window.location.pathname;
		sendData.completeUrl = window.location.href; // 页面的完整url
		sendData.customerKey = getCustomerKey(); // 用于区分用户，所对应唯一的标识，清理本地数据后失效，
		// 用户自定义信息， 由开发者主动传入， 便于对线上问题进行准确定位
		// sendData.userId = WEB_USER_ID;
		// sendData.deptId = WEB_DEPT_ID;
		sendData.os = devicesInfo.os + (devicesInfo.osVersion ? " " + devicesInfo.osVersion : ""),
			sendData.devicesInfo = JSON.stringify({
				deviceName: devicesInfo.deviceName,
				browserName: devicesInfo.browserName,
				browserVersion: devicesInfo.browserVersion
			});
		//this.firstUserParam = "";
		//this.secondUserParam = "";
	}
	window.__MONITORCLICKELEMENT__ = clickElement;
	window.__MONITORPAGELOAD__ = pageLoad;
}