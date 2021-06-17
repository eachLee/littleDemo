var centaLabWxSdk;
try {
  centaLabWxSdk = class centaLabWxSdk {
    constructor(data) {
      this.baseUrlObj = {
        test: 'https://trace.centanet.com/api/star/createstar',
        prod: 'https://trace.centanet.com/api/star/createstar'
      }
      this.sendData = {
        centaId: wx.getStorageSync('monitorCentaId') || {},
        source: {},
        tags: {},
      };
      this.config = wx.getStorageSync('monitorConfig') ? Object.assign(wx.getStorageSync('monitorConfig'), {
        from: '001-小程序',
        isMonitor: true,
        isLog: true,
        isDev: true,
      }) : {
          from: '001-小程序',
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
          tags: {},
        }, data)
      };
      this.baseUrl = this.config.isDev ? this.baseUrlObj.test : this.baseUrlObj.prod;

    }

    //初始化配置
    init(config) {
      if (wx.getStorageSync('monitorConfig') && typeof wx.getStorageSync('monitorConfig') === 'object') {
        wx.setStorage({ key: 'monitorConfig', data: Object.assign(wx.getStorageSync('monitorConfig'), config) });
      } else {
        wx.setStorage({ key: 'monitorConfig', data: config });
      }

      this.config = wx.getStorageSync('monitorConfig');

      if (!this.config.isDev) {
        this.baseUrl = this.baseUrlObj.prod;
      } else {
        this.baseUrl = this.baseUrlObj.test;
      }
      this.config.isLog && console.log('monitorConfig is: ', wx.getStorageSync('monitorConfig'));
    }
    //获取设备信息
    getDevice() {
      let deviceInfo = wx.getSystemInfoSync();
      return deviceInfo
    }

    // 设置日志对象类的通用属性
    setCommonProperty() {
      let currentPageObj = this.getCurrentPageInfo()
      // this.sendData.happenTime = this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'); // 日志发生时间
      this.sendData.happenTime = new Date().getTime(); // 日志发生时间
      // this.sendData.webMonitorId = wx.getStorageSync('monitorProjectId');     // 用于区分应用的唯一标识（一个项目对应一个）SCRM
      this.sendData.centaId.sessionId = this.getCustomerKey(); // 用于区分用户，所对应唯一的标识，清理本地数据后失效，
      // 用户自定义信息， 由开发者主动传入， 便于对线上问题进行准确定位
      this.sendData.centaId.devices = JSON.stringify({
        deviceName: this.devicesInfo.model,
        browserName: 'wechat',
        browserVersion: this.devicesInfo.version,
        os: this.devicesInfo.system,
      });
      this.sendData.source = {
        location: currentPageObj.url,
        from: this.config.from,
      }
      return this.sendData
    }

    //小程序内 获取当前页面信息
    getCurrentPageInfo() {
      let curentPageObj = {};
      var pages = getCurrentPages(); 				//获取加载的页面
      curentPageObj.currentPage = pages[pages.length - 1]   //获取当前页面的对象
      curentPageObj.url = curentPageObj.currentPage.route 				//获取页面url
      curentPageObj.urlParam = curentPageObj.currentPage.options //获取参数
      return curentPageObj
    }

    getCustomerKey() {
      var customerKey = this.getUuid();
      var reg = /^[0-9a-z]{8}(-[0-9a-z]{4}){3}-[0-9a-z]{12}-\d{13}$/;
      let monitorCustomerKey = wx.getStorageSync('monitorCustomerKey');
      if (!monitorCustomerKey) {
        wx.setStorage({ key: 'monitorCustomerKey', data: customerKey })
      } else if (!reg.test(monitorCustomerKey)) {
        wx.setStorage({ key: 'monitorCustomerKey', data: customerKey })
      }
      return wx.getStorageSync('monitorCustomerKey');
    };


    getUuid() {
      var timeStamp = new Date().getTime();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }) + "-" + timeStamp;
    };

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

    //合并对象 
    isMergeableObject(val) {
      var nonNullObject = val && typeof val === 'object'

      return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]'
    }

    emptyTarget(val) {
      return Array.isArray(val) ? [] : {}
    }

    cloneIfNecessary(value, optionsArgument) {
      var clone = optionsArgument && optionsArgument.clone === true
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
          destination.push(_this.cloneIfNecessary(e, optionsArgument))
        }
      })
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
      })
      return destination
    }

    deepmerge(target, source, optionsArgument) {
      var array = Array.isArray(source);
      var options = optionsArgument || { arrayMerge: this.defaultArrayMerge }
      var arrayMerge = options.arrayMerge || this.defaultArrayMerge

      if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : this.cloneIfNecessary(source, optionsArgument)
      } else {
        return this.mergeObject(target, source, optionsArgument)
      }
    }
    //存储userID
    setUserId(userId) {
      wx.setStorage({ key: 'monitorUserId', data: userId })
    }
    //存储user信息
    setUserInfo(userInfo) {
      wx.setStorage({ key: 'monitorUserInfo', data: userInfo })
    }
    //存储应用Id
    setAppId(appId) {
      wx.setStorage({ key: 'monitorAppId', data: appId })
    }

    //存储centaId相关信息
    customerInfo(centaIdObj) {
      if (wx.getStorageSync('monitorCentaId') && typeof wx.getStorageSync('monitorCentaId') === 'object') {
        wx.setStorage({ key: 'monitorCentaId', data: Object.assign(wx.getStorageSync('monitorCentaId'), centaIdObj) });
      } else {
        wx.setStorage({ key: 'monitorCentaId', data: centaIdObj });
      }
      this.config.isLog && console.log('monitorCentaId is: ', wx.getStorageSync('monitorCentaId'));
    }
    //发送请求
    trigger(data) {
      if (!this.config.isMonitor) {
        return
      }
      data = data || {}
      this.setCommonProperty();
      data = this.deepmerge(this.sendData, data)
      if (!this.tempData) {
        //用来暂存只需要传一次的内容 如openId等
        this.tempData = data;
        // wx.setStorage({ 'key': 'monitorCentaId', 'data': data });
      } else {
        data.test = data.test || this.tempData.test;
      }
      let url = this.baseUrl;
      this.config.isLog && console.log('sendData is: ', data);
      // url += '?behaviorData=' + encodeURIComponent('[' + JSON.stringify(data) + ']');
      wx.request({
        url: url,
        method: 'POST',
        header: {
          token: wx.getStorageSync('monitorProjectId'),

        },
        data: {
          "CityCode": data.cityCode,
          "DiamondJson": JSON.stringify([data]),
          "AppName": data.source.from
        },
        dataType: 'json',
        success() { },
        fail() { }
      });

    }
  }
  let lab = new centaLabWxSdk();
  //重写Page方法 用来处理全局事件
  const originPage = Page;
  Page = (page) => {
    let originOnShowMethod = page["onShow"] || function () { };
    page["onShow"] = function (options) {
      const pageObj = lab.getCurrentPageInfo();
      const currentPage = pageObj.currentPage;
      //开始计时
      page.start_time = new Date();
      page.can_track = true;
      originOnShowMethod.call(this, options);
    };

    let originOnUnloadMethod = page["onUnload"] || function () { };
    page["onUnload"] = function (options) {
      const pageObj = lab.getCurrentPageInfo();
      const currentPage = pageObj.currentPage;
      //停止计时
      if (page.can_track) {
        page.can_track = false;
        const page_stay_time = (new Date() - page.start_time) / 1000;
        let customSendData = page.pageBuriedData;
        lab.sendData.happenTime = page.start_time.getTime();
        lab.sendData.timeLong = page_stay_time;
        lab.sendData.action = 2;
        lab.trigger(customSendData);
      }
      originOnUnloadMethod.call(this, options);
    };

    let originOnHideMethod = page["onHide"] || function () { };
    page["onHide"] = function (options) {
      const pageObj = lab.getCurrentPageInfo();
      const currentPage = pageObj.currentPage;
      //停止计时
      if (page.can_track) {
        page.can_track = false;
        const page_stay_time = (new Date() - page.start_time) / 1000;
        let customSendData = page.pageBuriedData;
        lab.sendData.happenTime = page.start_time.getTime();
        lab.sendData.timeLong = page_stay_time;
        lab.sendData.action = 2;
        lab.trigger(customSendData);
      }
      originOnHideMethod.call(this, options);
    };

    let originOnReachBottomMethod = page["onReachBottom"] || function () { };
    page["onReachBottom"] = function (options) {
      const pageObj = lab.getCurrentPageInfo();
      const currentPage = pageObj.currentPage;
      //停止计时
      originOnReachBottomMethod.call(this, options);
    };
    return originPage(page);
  };

} catch (error) {
  console.log(error);
}
export { centaLabWxSdk }