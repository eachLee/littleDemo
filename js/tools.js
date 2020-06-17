var ToolsObj = function () { }

ToolsObj.prototype = {
  // 获取指定范围的随机数 返回整数 包含min和max值
  getRandomNum: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  // 获取当前地址的参数key为参数名
  getUrlParam: function (key) {
    var reg = new RegExp('[?|&]' + key + '=([^&]+)')
    var match = location.search.match(reg)
    return match && match[1]
  },
  //结构多维数组为扁平化数组 返回结构后得数组
  reArr: function (arr) {
    let newArr = [].concat(...arr);
    return newArr.some(Array.isArray) ? reArr(newArr) : newArr;
  },
  // 获取指定长度的随机字符串，参数为num 为指定的长度 返回字符串
  getrandomstr: function (num) {
    var str = ''
    for (var i = str.length; i < num; i = str.length) {
      str += Math.random()
        .toString(36)
        .slice(2)
    }
    str = str.slice(0, num)
    return str
  },
  // 获取url里的参数值 并返回一个包含对应参数相应的object对象 url 为指定网址
  getUrlParam: function (url) {
    var urlArr = [],
      urlObj = {}
    if (url.indexOf('?') > -1) {
      urlArr = url.split('?')
      if (urlArr[1].indexOf('&') > -1) {
        urlArr = urlArr[1].split('&')
        for (var i = 0; i < urlArr.length; i++) {
          var ele = urlArr[i]
          var eleArr = []
          if (ele.indexOf('=') > -1) {
            eleArr = ele.split('=')
            urlObj[eleArr[0]] = eleArr[1]
          }
        }
      } else {
        if (urlArr[1].indexOf('=') > -1) {
          var ele2Arr = urlArr[1].split('=')
          urlObj[ele2Arr[0]] = ele2Arr[1]
        }
      }
    }
    return urlObj
  },
  // 提升层级的一个函数 添加广告之后把高于添加广告层级的降低为9999
  upzindex: function () {
    var allA = document.getElementsByTagName('a'),
      allIfr = document.getElementsByTagName('iframe'),
      allDiv = document.getElementsByTagName('div')
    for (var i = 0; i < allA.length; i++) {
      var eleA = allA[i]
      if (eleA.style.zIndex && eleA.style.zIndex > 9999) {
        eleA.style.zIndex = 9999
        var aBottom = window.getComputedStyle(eleA).bottom.slice(0, -2)
        if (aBottom < 50) {
          var botA = window.getComputedStyle(eleA).height
          eleA.style.bottom = '-' + botA
        }
      }
    }
    for (var n = 0; n < allIfr.length; n++) {
      var eleIfr = allIfr[n]
      if (eleIfr.style.zIndex && eleIfr.style.zIndex > 9999) {
        eleIfr.style.zIndex = 9999
        var ifrBottom = window.getComputedStyle(eleIfr).bottom.slice(0, -2)
        if (ifrBottom < 50) {
          var botIfr = window.getComputedStyle(eleIfr).height
          eleIfr.style.bottom = '-' + botIfr
        }
      }
    }
    for (var m = 0; m < allDiv.length; m++) {
      var eleDiv = allDiv[m]
      if (eleDiv.id && eleDiv.id.indexOf('_so_') > -1) {
        continue
      }
      if (eleDiv.style.zIndex && eleDiv.style.zIndex > 9999) {
        eleDiv.style.zIndex = 9999
        var divBottom = window.getComputedStyle(eleDiv).bottom.slice(0, -2)
        if (divBottom < 50) {
          var bot = window.getComputedStyle(eleDiv).height
          eleDiv.style.bottom = '-' + bot
        }
      }
    }
  },
  getCookies: function (cookies, name) {
    // cookies 为string 必填项 cookie字符串
    // name 要获取的cookie名
    // 返回值为string
    var cookiesArr = []
    if (cookies && name) {
      cookiesArr = cookies.split('; ')
      for (var i = 0; i < cookiesArr.length; i++) {
        var ele = cookiesArr[i]
        var index = ele.indexOf(name + '=')
        if (index > -1) {
          return ele.split('=')[1]
        }
      }
    } else {
      return ''
    }
  },
  getCookie: function (name) {
    //name 值为cookie名
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
  },
  // 复制指定文本到剪切板上 参数为要复制的文本
  copyText: function (text) {
    var copyBox = document.createElement('input')
    copyBox.value = text
    document.body.appendChild(copyBox)
    copyBox.select()
    document.execCommand('copy')
    copyBox.style.display = 'none'
    copyBox.remove()
  },
  //模拟实现的一个sleep函数 es6以上支持 单位为ms
  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  // 判断设备是否支持触屏 返回boolean值
  hasTouch: function () {
    var touchObj = {}
    touchObj.isSupportTouch = 'ontouchend' in document ? true : false
    touchObj.isEvent = touchObj.isSupportTouch ? 'touchstart' : 'click'
    return touchObj.isSupportTouch
  },
  // 深复制对象 返回复制的对象
  deelClone: function (obj) {
    if (!obj) return
    // 一个检测传入的对象是否是指定类型的函数 返回boolean
    function isType(obj, type) {
      if (typeof obj !== 'object') return false
      var objType = Object.prototype.toString.call(obj).toLowerCase()
      var flag = false
      switch (type) {
        case 'array':
          flag = objType === '[object array]'
          break
        case 'date':
          flag = objType === '[object date]'
          break
        case 'regexp':
          flag = objType === '[object regexp]'
          break
        default:
          flag = false
      }
      return flag
    }
    // 获取regexp的参数 返回参数值
    function getRegexp(reg) {
      var flags = ''
      if (reg.global) flags += 'g'
      if (reg.ignoreCase) flags += 'i'
      if (reg.multiline) flags += 'm'
      return flags
    }
    //维护两个储存循环引用的数组
    var parents = []
    var children = []
    function cloneObj(obj) {
      var child, proto
      if (typeof obj === 'function') return obj
      if (typeof obj !== 'object') return obj
      if (isType(obj, 'array')) {
        // 对数组做特殊处理
        child = []
      } else if (isType(obj, 'regexp')) {
        // 对正则对象做特殊处理
        child = new RegExp(obj.source, getRegexp(obj))
        if (parent.lastIndex) child.lastIndex = parent.lastIndex
      } else if (isType(obj, 'date')) {
        // 对时间对象做特殊处理
        child = new Date(obj.getTime())
      } else {
        if (obj === null) {
          return obj
        } else {
          // 处理对象原型
          proto = Object.getPrototypeOf(obj)
          // 利用Object.create切断原型链
          child = Object.create(proto)
        }
      }

      // 处理循环引用
      var index = parents.indexOf(children)
      if (index > -1) {
        // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
        return children[index]
      }
      parents.push(obj)
      children.push(child)
      //  对对象做特殊处理
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 递归调用
          child[key] = cloneObj(obj[key])
        }
      }
      return child
    }
    return cloneObj(obj)
  },
  /**
   * 克隆对象
   * @param {Object} obj - 被判断的对象
   * @param {Boolean} cloneAll - 是否深度克隆,缺省false
   * @return {Object} - 返回新对象
   */
  //Fan神的方法 稍微修改版 有个别需要单独处理 如Date对象...
  deelClone2: function (obj, cloneAll) {
    switch (true) {
      case obj === null || obj === undefined:
      case typeof obj === 'number':
      case typeof obj === 'string':
        return obj
      case typeof obj === 'function' || obj instanceof Function:
        return cloneAll
          ? function () {
            return obj.apply(this, arguments)
          }
          : obj
      case obj instanceof RegExp:
        var reg = new RegExp(obj.source, obj.flags)
        reg.lastIndex = obj.lastIndex
        return reg
      case obj instanceof Date:
        var date = new Date(obj.getTime())
        return date
      case typeof obj === 'object' && !!obj:
        var newObj = obj instanceof Array ? [] : {}
        for (var i in obj) {
          if (i && obj.hasOwnProperty(i)) {
            newObj[i] = cloneAll ? cloneObject(obj[i]) : obj[i]
          }
        }
        return newObj
    }

    return obj
  },
  //根据身份证获取出生年月、性别、年龄
  getIdCardAnalysis(card, num) {
    if (num == 1) {
      //获取出生日期
      let birth = card.substring(6, 10) + "-" + card.substring(10, 12) + "-" + card.substring(12, 14);
      return birth;
    }
    if (num == 2) {
      //获取性别
      if (parseInt(card.substr(16, 1)) % 2 == 1) {
        //男
        return "男";
      } else {
        //女
        return "女";

      }
    }
    if (num == 3) {
      //获取年龄
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var age = myDate.getFullYear() - card.substring(6, 10) - 1;
      if (card.substring(10, 12) < month || card.substring(10, 12) == month && card.substring(12, 14) <= day) {
        age++;
      }
      return age;
    }
  },
  //语音回调方法 获取光标位置
  getCursortPosition: function (uniqueid, content) {
    content = decodeURIComponent(content);
    //获取光标所在位置
    var oTxt1 = document.getElementById(uniqueid);
    var cursurPosition = -1;
    if (oTxt1.selectionStart) {//非IE浏览器
      if (oTxt1.selectionStart != undefined) {
        cursurPosition = oTxt1.selectionStart;
      }
    } else {//IE
      if (document.selection != undefined) {
        var range = document.selection.createRange();
        range.moveStart("character", -oTxt1.value.length);
        cursurPosition = range.text.length;
      }
    }
    //合并内容
    var uniqueidremork = "";
    var remorklength = document.querySelector("#" + uniqueid).val().length;
    if (remorklength <= 0) {
      uniqueidremork = document.querySelector("#" + uniqueid).val() + content;
    } else {
      if (cursurPosition == -1) {
        uniqueidremork = document.querySelector("#" + uniqueid).val() + content;
      } else {
        uniqueidremork = document.querySelector("#" + uniqueid).val();
        uniqueidremork = uniqueidremork.substring(0, cursurPosition) + content + uniqueidremork.substring(cursurPosition, remorklength);
      }
    }
    //限制长度
    if (uniqueidremork.length > 500) {
      uniqueidremork = uniqueidremork.substring(0, 500);
    }
    document.querySelector("#" + uniqueid).val(uniqueidremork);
  },
  // 判断是否参数是否是NaN
  isNaN: function (n) {
    return n !== n
  },
  // len为生成字符串的长度默认为8，count为生成随机字符串的数量默认为1
  // 返回一个包含随机字符串的数组
  randomFn: function (len, count) {
    len = len || 8
    count = count || 1
    var randomStr
    var randomStrArr
    var arr = [
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ],
      ['%', '_', '&', '#', '*']
    ]
    let averageLen = Math.ceil(len / arr.length)
    let randomArr = []
    for (var n = 0; n < count; n++) {
      randomStrArr = []
      arr = arr.sort(function () {
        return Math.random() > 0.5
      })
      for (let i = 0; i < arr.length; i++) {
        const ele = arr[i]
        for (let n = 0; n < averageLen; n++) {
          randomStrArr.push(ele[Math.floor(Math.random() * ele.length)])
        }
      }
      randomStr = randomStrArr
        .sort(function () {
          return Math.random() > 0.5
        })
        .join('')
        .slice(0, len)
      randomArr.push(randomStr)
    }
    return randomArr
  }
}
var tools = new ToolsObj()
