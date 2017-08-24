var arr = ['ss', 1, 354, '天气', 646, 7, function () { }, 5734, 'tiani', '99999999', 67734434, 745457, 7, 46734567, '1245456754', '1244818991909190', 1132, 35, 3, 656, 122, 90];
// arr.sort(function (a, b) { //一般排序需求用sort方法都能解决
//     return a - b;
// });
console.log(arr);
function bubbleSort(arr) { //冒泡排序 两个字符串比较时会转换成ASCII码进行比较 所以会有一些意外发生
    for (var n = 0; n < arr.length; n++) {
        var index = 0;
        for (var i = 0; i < arr.length; i++) {
            index = i + 1;
            if (Number.parseFloat(arr[i]) > Number.parseFloat(arr[index])) {//解决有字符串会被转成ASCII码的问题
                var temp = arr[i];
                arr[i] = arr[index];
                arr[index] = temp;
            }
        }
    }
    return arr;
}
console.log(bubbleSort(arr));
function selectionSort(arr) { //选择排序 同冒泡排序一样 字符串比较会转成ASCII码 个人觉得比插入排序和冒泡排序好
    var minIndex, temp;
    for (var i = 0; i < arr.length; i++) {
        minIndex = i;
        for (var j = i + 1; j < arr.length; j++) {
            var element = arr[j];
            if (Number.parseFloat(element) < Number.parseFloat(arr[minIndex])) {
                minIndex = j;
            }
        }
        temp = arr[minIndex];
        arr[minIndex] = arr[i];
        arr[i] = temp;
    }
    return arr;
}
// console.log(selectionSort(arr));

function insertSort(arr) { //插入排序 碰见无法转成数字的字符串会无法排序
    var len = arr.length;
    for (var i = 1; i < len; i++) {
        var ele = arr[i];
        var j = i - 1;
        while (j >= 0 && Number.parseFloat(arr[j]) > Number.parseFloat(ele)) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = ele;
    }
    return arr;
}
// console.log(insertSort(arr));

function shellSort(arr) { //  希尔排序 插入排序的改进版 有跟插入排序一样的问题 有时更严重
    var len = arr.length;
    var temp, index = 1;
    while (index < len / 3) {
        index = index * 3 + 1;
    }
    while (index > 0) {
        for (var i = index; i < len; i++) {
            temp = arr[i];
            for (var j = i - index; j >= 0 && arr[j] > temp; j -= index) {
                arr[j + index] = arr[j];
            }
            arr[j + index] = temp;
        }
        index = (index - 1) / 3;
    }
    return arr;
}
// console.log(shellSort(arr));


function qSort(arr) { // 快速排序
    var len = arr.length;
    if (len === 0) {
        return [];
    }
    var left = [], right = [], num = arr[0];
    for (var i = 1; i < arr.length; i++) {
        var ele = arr[i];
        if (Number.parseFloat(ele) > Number.parseFloat(num)) {
            right.push(ele);
        } else {
            left.push(ele);
        }
    }
    return qSort(left).concat(num, qSort(right));

}

// console.log(qSort(arr));

function gbSort(arr) { //归并排序
    var len = arr.length;
    if (len < 2) {
        return arr;
    }
    var mid = Math.floor(len / 2);
    var left = arr.slice(0, mid);
    var right = arr.slice(mid);
    return gb(gbSort(left), gbSort(right)); //递归调用知道全部分割为单个元素的数组
}
function gb(left, right) {
    var arr = [];
    while (left.length && right.length) {
        if (Number.parseFloat(left[0]) < Number.parseFloat(right[0])) {//比较两个数组 并按大小放进arr里
            arr.push(left.shift());
        } else {
            arr.push(right.shift());
        }
    }
    return arr.concat(left).concat(right);
}
// console.log(gbSort(arr));