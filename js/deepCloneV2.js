var obj = { a: 1, b: 2, c: { d: 3, e: [{ f: 1, g: 2 }] }, h: null };
obj.h = obj;
var res;
// 缺点就是不能复制函数 会抛出错误 优点是处理循环引用的数据时速度很快
// 传了数据给管道，管道传回来一个长得一模一样的数据回来，实现了深拷贝。
//我们叫他结构化克隆，能处理对象循环依赖和大部分的内置对象。
//比如postMessage发消息给子窗口或者WebWorker的时候就会经常用到，拿到数据进行处理，但不污染原数据。
new Promise(resolve => {
	var channel = new MessageChannel();
	channel.port2.onmessage = ev => resolve(ev.data);
	channel.port1.postMessage(obj);
}).then(data => {
	res = data;
	console.log(res);
});
