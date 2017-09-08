! function () {
    // 下拉刷新页面
    var box = document.getElementById('container'),
        loading = box.getElementsByClassName('loading')[0],
        ulList = box.getElementsByTagName('ul')[0],
        parent = box.parentElement,
        offset = loading.clientHeight;
    var start,
        length,
        isLock = false,
        isCanDo = false,
        screenH = window.screen.height,
        istouchPad = (/hp-tablit/ig).test(navigator.appVersion),
        hastouch = 'ontouchstart' in window && !istouchPad,
        end;
    var num = 0;
    var fn = {
        // 移动容器
        trans: function (diff) {
            box.style.transform = 'translate3d(0,' + (-diff) + 'px,0)';
        },
        // 设置动画时长
        setTranstion: function (time) {
            box.style.transition = time + 's';
        },
        // 回到初始位置
        back: function (time, offset) {
            setTimeout(function () {
                box.style.transform = 'translate3d(0,' + (-offset) + 'px,0)';
                isLock = false;
            }, time);

        },
        addEvent: function (ele, eventName, eventFn) {
            if (ele.addEventListener) {
                ele.addEventListener(eventName, eventFn, false);
            } else if (ele.attachEvent) {
                ele.attachEvent('on' + eventName, eventFn);
            } else {
                ele['on' + eventName] = eventFn;
            }
        }
    };

    var list = `<li><a href="#">我是新加的1</a></li>
            <li><a href="#">我是新加的2</a></li>
            <li><a href="#">我是新加的3</a></li>
            <li><a href="#">我是新加的4</a></li>
            <li><a href="#">我是新加的5</a></li>
            <li>........以上为新内容.........</li>`;

    fn.trans(offset);
    fn.addEvent(parent, 'touchstart', startFn);
    fn.addEvent(parent, 'touchmove', move);
    fn.addEvent(parent, 'touchend', endFn);
    // 以下为pc端数据
    fn.addEvent(parent, 'mousedown', startFn);
    fn.addEvent(parent, 'mousemove', move);
    fn.addEvent(parent, 'mouseup', endFn);

    function startFn(e) {
        if (parent.scrollTop <= 0 && !isLock) {
            isLock = true;
            isCanDo = true;
            e = e || event;
            start = hastouch ? e.targetTouches[0].pageY : e.pageY;
        }
    }

    function move(e) {
        //  parent.scrollTop 为了兼容pc端 只是移动端的话 不需要
        if (parent.scrollTop <= 0 && isCanDo) {
            e = e || event;
            end = hastouch ? e.targetTouches[0].pageY : e.pageY;
            if (end > screenH / 2) end = screenH / 2;
            if (end > start && (end - start > 10)) {
                e.preventDefault();
                fn.trans(start - end + offset);
                fn.setTranstion(.5);
                loading.innerHTML = '下拉刷新';
            }
        }

    }

    function endFn(e) { // 后续可以在此添加请求后台数据的逻辑
        if (isCanDo) {
            isCanDo = false;
            e = e || event;
            if (end - start >= offset) { // 可以在此处添加ajax请求后台数据添加
                fn.trans(0);
                fn.setTranstion(.3);
                setTimeout(function () {
                    loading.innerHTML = '刷新成功√';
                }, 800);
                fn.back(1000, offset);
                ulList.innerHTML = list + ulList.innerHTML;
                loading.innerHTML = '正在刷新';
            } else {
                fn.trans(offset);
            }
        }
    }
}();