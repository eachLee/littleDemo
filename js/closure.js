function buildArr(list) {
	var arr = [];
	for (var n = 0; n < list.length; n++) {
		var ele = 'item' + list[n];
		arr.push(function () {
			console.log(ele + '' + list[n]);
		});
	}
	return arr;
}
var initList = buildArr([1, 2, 3]);
for (var i = 0; i < initList.length; i++) {
	initList[i]();//输出3次 'item3undefined'
}

function buildArr2(list) { // 解决方案 1 用let声明变量 形成单独的作用域
	var arr = [];
	for (let n = 0; n < list.length; n++) {
		let ele = 'item' + list[n];
		arr.push(function () {
			console.log(ele + '' + list[n]);
		});
	}
	return arr;
}
var initList2 = buildArr2([1, 2, 3]);
for (var m = 0; m < initList.length; m++) {
	initList2[m]();// item11 item22 item33
}


function buildArr3(list) { // 解决方案2 利用自执行函数形成单独的作用域 然后push进数组里
	var arr = [];
	for (var n = 0; n < list.length; n++) {
		var ele = 'item' + list[n];
		(function (ele, list) {
			arr.push(function () {
				console.log(ele + '' + list);
			});
		}(ele, list[n]));
	}
	return arr;
}
var initList3 = buildArr3([1, 2, 3]);
for (var s = 0; s < initList3.length; s++) {
	initList3[s]();// item11 item22 item33
}