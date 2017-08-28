
function throttle(fn, runTime = 500) { // 添加滚动时间的阈值 保证fn函数不会被太频繁的触发
    var previous = null;
    return function () {
        var now = new Date(),
            that = this;
        if (!previous) {
            previous = now;
        }
        var rt = now - previous;
        if (runTime && rt >= runTime) {
            fn.call(that);
            previous = now; //更新此次的时间
        }
    };
}

function checkImgs() {
    var allImgs = document.querySelectorAll('.my-photo'); // 获取所有的指定标签
    allImgs.forEach(function (val) {
        io.observe(val); //给每一个标签都绑定一个observe事件
    });
}
function loadimg(ele) { // 更新src
    if (!ele.src) {
        var src = ele.dataset.src;
        ele.src = src;
    }
}
var io = new IntersectionObserver(function (vst) { // vsr 是一个数组，每个成员都是一个IntersectionObserverEntry对象
    /**
     *
        IntersectionObserverEntry对象的属性：
        time：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
        target：被观察的目标元素，是一个 DOM 节点对象
        rootBounds：根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
        boundingClientRect：目标元素的矩形区域的信息
        intersectionRect：目标元素与视口（或根元素）的交叉区域的信息
        intersectionRatio：目标元素的可见比例，即intersectionRect占boundingClientRect的比例，完全可见时为1，完全不可见时小于等于0


     */
    vst.forEach(function (val) {
        var ele = val.target;
        if (val.intersectionRatio > 0 && val.intersectionRatio <= 1) {
            loadimg(ele);
        }
        ele.onload = ele.onerror = () => io.unobserve(ele);
    });
});