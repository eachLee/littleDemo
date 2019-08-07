function readerText() {
	var reader = new FileReader();
	var file = document.getElementById('file').files[0];
	var textArea = document.getElementById('textArea');
	var downBtn = document.getElementById('download');
	if (!file) return;
	console.log(file);
	reader.onload = function(event) {
		var text = event.target.result;
		textArea.value = text;
		console.log(event);
		downBtn.onclick = funDownload.bind(this, text, file.name);
	};
	reader.readAsText(file);
}

var funDownload = function (content, filename) {
	// 创建隐藏的可下载链接
	var eleLink = document.createElement('a');
	eleLink.download = filename;
	eleLink.style.display = 'none';
	// 字符内容转变成blob地址
	var blob = new Blob([content]);
	eleLink.href = URL.createObjectURL(blob);
	// 触发点击
	document.body.appendChild(eleLink);
	eleLink.click();
	// 然后移除
	document.body.removeChild(eleLink);
};
