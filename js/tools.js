let ToolsObj = class ToolsObj {
  //获取指定位数的四舍五入 num为数字 d为尾数
  roundNum(num, d) { return Number(Math.round(n + "e" + d) + "e-" + d) }

  //去除文本里的html标签 返回替换后的文本
  stripHtml(html) { return (new DOMParser().parseFromString(html, 'text/html')).body.textContent || '' }

  // 获取指定范围的随机数 返回整数 包含min和max值
  getRandomNum(min, max) { Math.floor(Math.random() * (max - min + 1) + min) }
  // 获取当前地址的参数key为参数名
  getUrlParam(key) {
    let reg = new RegExp('[?|&]' + key + '=([^&]+)')
    let match = location.search.match(reg)
    return match && match[1]
  }
  //结构多维数组为扁平化数组 返回结构后得数组
  reArr(arr) {
    let newArr = [].concat(...arr);
    return newArr.some(Array.isArray) ? reArr(newArr) : newArr;
  }
  // 获取指定长度的随机字符串，参数为num 为指定的长度 返回字符串
  getrandomstr(num) {
    let str = ''
    for (let i = str.length; i < num; i = str.length) {
      str += Math.random()
        .toString(36)
        .slice(2)
    }
    str = str.slice(0, num)
    return str
  }
  // 获取url里的参数值 并返回一个包含对应参数相应的object对象 url 为指定网址
  getUrlParam(url = location.href) {
    let urlArr = [],
      urlObj = {}
    if (url.indexOf('?') > -1) {
      urlArr = url.split('?')
      if (urlArr[1].indexOf('&') > -1) {
        urlArr = urlArr[1].split('&')
        for (let i = 0; i < urlArr.length; i++) {
          let ele = urlArr[i]
          let eleArr = []
          if (ele.indexOf('=') > -1) {
            eleArr = ele.split('=')
            urlObj[eleArr[0]] = eleArr[1]
          }
        }
      } else {
        if (urlArr[1].indexOf('=') > -1) {
          let ele2Arr = urlArr[1].split('=')
          urlObj[ele2Arr[0]] = ele2Arr[1]
        }
      }
    }
    return urlObj
  }
  // 提升层级的一个函数 添加广告之后把高于添加广告层级的降低为9999
  upzindex() {
    let allA = document.getElementsByTagName('a'),
      allIfr = document.getElementsByTagName('iframe'),
      allDiv = document.getElementsByTagName('div')
    for (let i = 0; i < allA.length; i++) {
      let eleA = allA[i]
      if (eleA.style.zIndex && eleA.style.zIndex > 9999) {
        eleA.style.zIndex = 9999
        let aBottom = window.getComputedStyle(eleA).bottom.slice(0, -2)
        if (aBottom < 50) {
          let botA = window.getComputedStyle(eleA).height
          eleA.style.bottom = '-' + botA
        }
      }
    }
    for (let n = 0; n < allIfr.length; n++) {
      let eleIfr = allIfr[n]
      if (eleIfr.style.zIndex && eleIfr.style.zIndex > 9999) {
        eleIfr.style.zIndex = 9999
        let ifrBottom = window.getComputedStyle(eleIfr).bottom.slice(0, -2)
        if (ifrBottom < 50) {
          let botIfr = window.getComputedStyle(eleIfr).height
          eleIfr.style.bottom = '-' + botIfr
        }
      }
    }
    for (let m = 0; m < allDiv.length; m++) {
      let eleDiv = allDiv[m]
      if (eleDiv.id && eleDiv.id.indexOf('_so_') > -1) {
        continue
      }
      if (eleDiv.style.zIndex && eleDiv.style.zIndex > 9999) {
        eleDiv.style.zIndex = 9999
        let divBottom = window.getComputedStyle(eleDiv).bottom.slice(0, -2)
        if (divBottom < 50) {
          let bot = window.getComputedStyle(eleDiv).height
          eleDiv.style.bottom = '-' + bot
        }
      }
    }
  }
  getCookies(cookies, name) {
    // cookies 为string 必填项 cookie字符串
    // name 要获取的cookie名
    // 返回值为string
    let cookiesArr = []
    if (cookies && name) {
      cookiesArr = cookies.split('; ')
      for (let i = 0; i < cookiesArr.length; i++) {
        let ele = cookiesArr[i]
        let index = ele.indexOf(name + '=')
        if (index > -1) {
          return ele.split('=')[1]
        }
      }
    } else {
      return ''
    }
  }
  getCookie(name) {
    //name 值为cookie名
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
  }
  // 复制指定文本到剪切板上 参数为要复制的文本
  copyText(text) {
    let copyBox = document.createElement('input')
    copyBox.value = text
    document.body.appendChild(copyBox)
    copyBox.select()
    document.execCommand('copy')
    copyBox.style.display = 'none'
    copyBox.remove()
  }
  //模拟实现的一个sleep函数 es6以上支持 单位为ms
  sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
  // 判断设备是否支持触屏 返回boolean值
  hasTouch() {
    let touchObj = {}
    touchObj.isSupportTouch = 'ontouchend' in document ? true : false
    touchObj.isEvent = touchObj.isSupportTouch ? 'touchstart' : 'click'
    return touchObj.isSupportTouch
  }
  // 深复制对象 返回复制的对象
  deelClone(obj) {
    if (!obj) return
    // 一个检测传入的对象是否是指定类型的函数 返回boolean
    function isType(obj, type) {
      if (typeof obj !== 'object') return false
      let objType = Object.prototype.toString.call(obj).toLowerCase()
      let flag = false
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
      let flags = ''
      if (reg.global) flags += 'g'
      if (reg.ignoreCase) flags += 'i'
      if (reg.multiline) flags += 'm'
      return flags
    }
    //维护两个储存循环引用的数组
    let parents = []
    let children = []
    function cloneObj(obj) {
      let child, proto
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
      let index = parents.indexOf(children)
      if (index > -1) {
        // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
        return children[index]
      }
      parents.push(obj)
      children.push(child)
      //  对对象做特殊处理
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 递归调用
          child[key] = cloneObj(obj[key])
        }
      }
      return child
    }
    return cloneObj(obj)
  }
  // chatgpt 优化版
  deepClone(obj) {
    if (!obj) return;

    // 使用 Map 来存储对象的映射关系
    const map = new Map();

    function isType(obj, type) {
      if (typeof obj !== 'object') return false;
      switch (type) {
        case 'array':
          return Array.isArray(obj);
        case 'date':
          return obj instanceof Date;
        case 'regexp':
          return obj instanceof RegExp;
        default:
          return false;
      }
    }

    function getRegexp(reg) {
      if (!(reg instanceof RegExp)) return '';
      let flags = '';
      if (reg.global) flags += 'g';
      if (reg.ignoreCase) flags += 'i';
      if (reg.multiline) flags += 'm';
      return flags;
    }

    function cloneObj(obj) {
      if (typeof obj === 'function') return obj;
      if (typeof obj !== 'object') return obj;

      if (isType(obj, 'array')) {
        // 对数组做特殊处理
        return obj.map(item => cloneObj(item));
      } else if (isType(obj, 'regexp')) {
        // 对正则对象做特殊处理
        return new RegExp(obj.source, getRegexp(obj));
      } else if (isType(obj, 'date')) {
        // 对时间对象做特殊处理
        return new Date(obj.getTime());
      }

      // 处理对象原型
      let proto = Object.getPrototypeOf(obj);
      // 创建空对象作为复制对象，并存储映射关系
      const child = Object.create(proto);
      map.set(obj, child);

      // 对对象做特殊处理
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 递归调用
          child[key] = cloneObj(obj[key]);
        }
      }
      return child;
    }

    return cloneObj(obj);
  }

  /**
   * 克隆对象
   * @param {Object} obj - 被判断的对象
   * @param {Boolean} cloneAll - 是否深度克隆,缺省false
   * @return {Object} - 返回新对象
   */
  //Fan神的方法 稍微修改版 有个别需要单独处理 如Date对象...
  deelClone2(obj, cloneAll) {
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
        let reg = new RegExp(obj.source, obj.flags)
        reg.lastIndex = obj.lastIndex
        return reg
      case obj instanceof Date:
        let date = new Date(obj.getTime())
        return date
      case typeof obj === 'object' && !!obj:
        let newObj = obj instanceof Array ? [] : {}
        for (let i in obj) {
          if (i && obj.hasOwnProperty(i)) {
            newObj[i] = cloneAll ? cloneObject(obj[i]) : obj[i]
          }
        }
        return newObj
    }

    return obj
  }
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
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = myDate.getFullYear() - card.substring(6, 10) - 1;
      if (card.substring(10, 12) < month || card.substring(10, 12) == month && card.substring(12, 14) <= day) {
        age++;
      }
      return age;
    }
  }
  //语音回调方法 获取光标位置
  getCursortPosition(uniqueid, content) {
    content = decodeURIComponent(content);
    //获取光标所在位置
    let oTxt1 = document.getElementById(uniqueid);
    let cursurPosition = -1;
    if (oTxt1.selectionStart) {//非IE浏览器
      if (oTxt1.selectionStart != undefined) {
        cursurPosition = oTxt1.selectionStart;
      }
    } else {//IE
      if (document.selection != undefined) {
        let range = document.selection.createRange();
        range.moveStart("character", -oTxt1.value.length);
        cursurPosition = range.text.length;
      }
    }
    //合并内容
    let uniqueidremork = "";
    let remorklength = document.querySelector("#" + uniqueid).val().length;
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
  }
  // 判断是否参数是否是NaN
  isNaN(n) {
    return n !== n
  }
  //根据xpath获取指定元素
  evalXpath(STR_XPATH) {
    let xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    let xnodes = [];
    let xres;
    while (xres = xresult.iterateNext()) {
      xnodes.push(xres);
    }

    return xnodes;
  }
  // len为生成字符串的长度默认为8，count为生成随机字符串的数量默认为1
  // 返回一个包含随机字符串的数组
  randomFn(len, count) {
    len = len || 8
    count = count || 1
    let randomStr
    let randomStrArr
    let arr = [
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
    for (let n = 0; n < count; n++) {
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
  //格式化日期 value为日期 link为链接符
  formatterDate(value, link = '-') {
    let date = new Date(value);
    let dateStr = "";
    let year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate();
    if (year == 1970) {
      dateStr = "";
    } else {
      dateStr = year + link + ('0' + month).slice(-2) + link + ('0' + day).slice(-2);
    }
    return dateStr;
  }
  //获取当前周的日期
  getCurrentWeek() {
    let weekDate = [];
    for (let i = 0; i < 7; i++) {
      if (i == (new Date().getDay() || 7) - 1) {
        weekDate.push(ToolsObj.formatterDate(new Date()))
      } else {
        weekDate.push(ToolsObj.formatterDate(new Date(new Date().getTime() - (new Date().getDay() - 1 - i) * 1000 * 60 * 60 * 24)))
      }
    }
    console.log(weekDate);
  }
  //深合并对象 
  deepMergeObjcet(target, source, optionsArgument) {
    function isMergeableObject(val) {
      let nonNullObject = val && typeof val === 'object'

      return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]'
    }

    function emptyTarget(val) {
      return Array.isArray(val) ? [] : {}
    }

    function cloneIfNecessary(value, optionsArgument) {
      let clone = optionsArgument && optionsArgument.clone === true
      return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
    }

    function defaultArrayMerge(target, source, optionsArgument) {
      let destination = target.slice()
      source.forEach(function (e, i) {
        if (typeof destination[i] === 'undefined') {
          destination[i] = cloneIfNecessary(e, optionsArgument)
        } else if (isMergeableObject(e)) {
          destination[i] = deepmerge(target[i], e, optionsArgument)
        } else if (target.indexOf(e) === -1) {
          destination.push(cloneIfNecessary(e, optionsArgument))
        }
      })
      return destination
    }

    function mergeObject(target, source, optionsArgument) {
      let destination = {}
      if (isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
          destination[key] = cloneIfNecessary(target[key], optionsArgument)
        })
      }
      Object.keys(source).forEach(function (key) {
        if (!isMergeableObject(source[key]) || !target[key]) {
          destination[key] = cloneIfNecessary(source[key], optionsArgument)
        } else {
          destination[key] = deepmerge(target[key], source[key], optionsArgument)
        }
      })
      return destination
    }

    function deepmerge(target, source, optionsArgument) {
      let array = Array.isArray(source);
      let options = optionsArgument || { arrayMerge: defaultArrayMerge }
      let arrayMerge = options.arrayMerge || defaultArrayMerge

      if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
      } else {
        return mergeObject(target, source, optionsArgument)
      }
    }

    deepmerge.all = function deepmergeAll(array, optionsArgument) {
      if (!Array.isArray(array) || array.length < 2) {
        throw new Error('first argument should be an array with at least two elements')
      }

      return array.reduce(function (prev, next) {
        return deepmerge(prev, next, optionsArgument)
      })
    }
    return deepmerge(target, source, optionsArgument);
  }
}
let tools = new ToolsObj()
