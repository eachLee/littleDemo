var centaLabSdk;
try {
  centaLabSdk = class CentaLabSdk {
    constructor(data) {
      this.baseUrlObj = {
        test: 'https://trace.centanet.com/api/star/createstar',
        prod: 'https://trace.centanet.com/api/star/createstar'
      };
      this.sendData = {
        centaId: this.getLocalStorage('monitorCentaId', true) || {},
        source: {},
      };
      this.config = this.getLocalStorage('monitorConfig', true) ? Object.assign({
        from: '002-资讯',
        isMonitor: true,
        isLog: true,
        isDev: true,
      }, this.getLocalStorage('monitorConfig', true)) : {
        from: '002-资讯',
        isMonitor: true,
        isLog: true,
        isDev: true,
      };
      this.tempData;
      this.devicesInfo = this.getDevice();
      if (data && typeof data === 'object') {
        this.sendData = Object.assign({
          centaId: {},
          source: {},
        }, data)
      };
      this.baseUrl = this.config.isDev ? this.baseUrlObj.test : this.baseUrlObj.prod;

    }
    //获取localStorage
    getLocalStorage(name, isObject) {
      if (name) {
        let data = localStorage.getItem(name);
        if (isObject) {
          if (data) {
            return JSON.parse(data);
          }
        } else {
          return data;
        }
      } else {
        return '';
      }
    }
    //设置localStorage
    setLocalStorage(name, data) {
      if (name && data) {
        if (typeof data === 'object') {
          localStorage.setItem(name, JSON.stringify(data));
        } else {
          localStorage.setItem(name, data);
        }
      }
    }
    //初始化配置
    init(config) {
      if (this.getLocalStorage('monitorConfig', true)) {
        this.setLocalStorage('monitorConfig', Object.assign(this.getLocalStorage('monitorConfig', true), config));
      } else {
        this.setLocalStorage('monitorConfig', config);
      }

      this.config = this.getLocalStorage('monitorConfig', true) || {};

      if (!this.config.isDev) {
        this.baseUrl = this.baseUrlObj.prod;
      } else {
        this.baseUrl = this.baseUrlObj.test;
      }
      this.config.isLog && console.log('monitorConfig is: ', this.getLocalStorage('monitorConfig', true));
    }

    // 根据元素读取xPath
    readXPath(element) {
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
          return this.readXPath(element.parentNode) + '/' + element.tagName.toLowerCase();
        }
        //如果这个元素是siblings数组中的元素，则执行递归操作
        if (sibling == element) {
          return this.readXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
          //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
        } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
          ix++;
        }
      }
    }

    //获取属性列表
    getAttrList(element) {
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
    pageLoad() {
      this.devicesInfo = this.getDevice();
      this.setCommonProperty();
      return this.sendData;
    }
    clickElement(e) {
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
      var attributeName = "";
      if (e.target.tagName.toLowerCase() != "svg" && e.target.tagName.toLowerCase() != "use") {
        xpath = this.readXPath(e.target);
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
        attributeName = this.getAttrList(e.target);
        if (attributeName.length > 50) attributeName = attributeName.substring(0, 50)
      }
      // if ((innerText == '' && inputValue == '') || innerText.length > 10) {
      //    return;
      // }
      this.sendData.uploadType = 'ELE_BEHAVIOR';
      this.sendData.behaviorType = 'click';
      this.sendData.sourceId = sourceId;
      this.sendData.className = (className);
      this.sendData.placeholder = (placeholder);
      this.sendData.inputValue = (inputValue);
      this.sendData.tagName = tagName;
      this.sendData.tagType = tagType;
      this.sendData.innerText = innerText;
      this.sendData.xpath = xpath;
      this.sendData.attributeName = attributeName;
      this.devicesInfo = this.getDevice();
      this.setCommonProperty();
      return this.sendData;
    }
    //获取设备信息
    getDevice() {
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
          device.deviceName = "iphone X/S/11 Pro/12 Mini";
        } else if (screenWidth === 414 && screenHeight === 896) {
          device.deviceName = "iphone Xr/11/11 Pro Max";
        } else if (screenWidth === 390 && screenHeight === 844) {
          device.deviceName = "iphone 12/12 Pro";
        } else if (screenWidth === 428 && screenHeight === 926) {
          device.deviceName = "iphone 12 Pro Max";
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
        var regStr_ff = /firefox\/[\d.]+/gi;
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


    //格式化时间
    dateFormat(date, fmt) {
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

    getUuid() {
      var timeStamp = new Date().getTime();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }) + "-" + timeStamp;
    };


    getCustomerKey() {
      var customerKey = this.getUuid();
      var reg = /^[0-9a-z]{8}(-[0-9a-z]{4}){3}-[0-9a-z]{12}-\d{13}$/;
      if (!localStorage.monitorCustomerKey) {
        localStorage.monitorCustomerKey = customerKey;
      } else if (!reg.test(localStorage.monitorCustomerKey)) {
        localStorage.monitorCustomerKey = customerKey;
      }
      return localStorage.monitorCustomerKey;
    };
    // 设置日志对象类的通用属性
    setCommonProperty() {
      this.sendData.happenTime = new Date().getTime(); // 日志发生时间
      // this.sendData.webMonitorId = localStorage.getItem('monitorProjectId') || 'c84630e6-e878-4e6f-9812-bba9db5c2ab2';     // 用于区分应用的唯一标识（一个项目对应一个）SCRM
      //this.uri = window.location.href.split('?')[0].replace('#', ''); // 页面的url

      this.sendData.centaId.sessionId = this.getCustomerKey(); // 用于区分用户，所对应唯一的标识，清理本地数据后失效，
      // 用户自定义信息， 由开发者主动传入， 便于对线上问题进行准确定位
      // sendData.userId = WEB_USER_ID;
      // sendData.deptId = WEB_DEPT_ID;
      this.sendData.centaId.device = JSON.stringify({
        deviceName: this.devicesInfo.deviceName,
        browserName: this.devicesInfo.os,
        browserVersion: this.devicesInfo.osVersion
      });
      this.sendData.cityCode = this.config.cityCode;
      this.sendData.source = this.mergeObject({
        from: this.config.from,
        location: window.location.pathname[0] == "/" ? window.location.pathname.slice(1) : window.location.pathname,
        sourceObject: {
          completeUrl: window.location.href,
          title: document.title,
        }
      }, this.sendData.source)
    }

    //合并对象 
    isMergeableObject(val) {
      var nonNullObject = val && typeof val === 'object';

      return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]'
    }

    emptyTarget(val) {
      return Array.isArray(val) ? [] : {}
    }

    cloneIfNecessary(value, optionsArgument) {
      var clone = optionsArgument && optionsArgument.clone === true;
      return (clone && this.isMergeableObject(value)) ? this.deepmerge(this.emptyTarget(value), value, optionsArgument) : value
    }

    defaultArrayMerge(target, source, optionsArgument) {
      var destination = target.slice();
      var _this = this;
      source.forEach(function (e, i) {
        if (typeof destination[i] === 'undefined') {
          destination[i] = _this.cloneIfNecessary(e, optionsArgument)
        } else if (_this.isMergeableObject(e)) {
          destination[i] = _this.deepmerge(target[i], e, optionsArgument)
        } else if (target.indexOf(e) === -1) {
          destination.push(_this.cloneIfNecessary(e, optionsArgument));
        }
      });
      return destination
    }

    mergeObject(target, source, optionsArgument) {
      var destination = {};
      var _this = this;
      if (this.isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
          destination[key] = _this.cloneIfNecessary(target[key], optionsArgument)
        })
      }
      Object.keys(source).forEach(function (key) {
        if (!_this.isMergeableObject(source[key]) || !target[key]) {
          destination[key] = _this.cloneIfNecessary(source[key], optionsArgument)
        } else {
          destination[key] = _this.deepmerge(target[key], source[key], optionsArgument)
        }
      });
      return destination
    }

    deepmerge(target, source, optionsArgument) {
      var array = Array.isArray(source);
      var options = optionsArgument || { arrayMerge: this.defaultArrayMerge };
      var arrayMerge = options.arrayMerge || this.defaultArrayMerge;

      if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : this.cloneIfNecessary(source, optionsArgument)
      } else {
        return this.mergeObject(target, source, optionsArgument);
      }
    }
    //存储centaId相关信息
    customerInfo(centaIdObj) {
      if (this.getLocalStorage('monitorCentaId', true)) {
        this.setLocalStorage('monitorCentaId', Object.assign(this.getLocalStorage('monitorCentaId', true), centaIdObj));
      } else {
        this.setLocalStorage('monitorCentaId', centaIdObj);
      }
      this.config.isLog && console.log('monitorCentaId is: ', this.getLocalStorage('monitorCentaId', true));
    }
    //发送请求
    trigger(data) {
      if (!this.config.isMonitor) {
        return
      }
      data = data || {};
      this.setCommonProperty();
      data = this.deepmerge(this.sendData, data);
      // var formData = new FormData();
      // formData.append('data', `[${JSON.stringify(data)}]`);
      // let url = this.baseUrl;
      this.config.isLog && console.log('sendData is: ', data);
      if (window.fetch) {
        fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            "CityCode": data.cityCode,
            "DiamondJson": JSON.stringify([data]),
            "AppName": data.source.from
          })
        })
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.baseUrl, true);
        xhr.send(JSON.stringify({
          "CityCode": data.cityCode,
          "DiamondJson": JSON.stringify([data]),
          "AppName": data.source.from
        }));
      }

    }

    //设置公共时间戳 用于计算页面停留时间
    setTimestemp() {
      var timeStamp = localStorage.getItem('monitorStytemTimestemp');
      this.pageLoad();
      if (!timeStamp) {
        timeStamp = Date.now();
        localStorage.setItem('monitorStytemTimestemp', timeStamp);
      }
      var _this = this;
      //监听浏览器前进后退事件 
      window.addEventListener('beforeunload', async function (e) {
        var stayTime = (Date.now() - timeStamp);
        _this.stayTime = stayTime;
        _this.setCommonProperty();
        //合并页面埋点信息
        _this.config.isLog && console.log('pageBuriedData is: ', JSON.stringify(this.pageBuriedData));
        if (this.pageBuriedData) {
          _this.sendData = _this.deepmerge(_this.sendData, this.pageBuriedData);
          if (this.pageBuriedData.source && this.pageBuriedData.source.evenStayId) {
            _this.sendData.source.eventId = this.pageBuriedData.source.evenStayId;
            _this.sendData.timeLong = stayTime;
            _this.sendData.action = 2;
            _this.trigger(_this.sendData);
          } else {
            return void 0;
          }
        }
        localStorage.setItem('monitorStytemTimestemp', Date.now());
      })
    }
  };
  let lab = new centaLabSdk();
  lab.setTimestemp();
} catch (error) {
  console.log(error);
}

window.centaLabSdk = centaLabSdk;