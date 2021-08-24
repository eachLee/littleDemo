var file = document.getElementById('file'),
    imgs = document.getElementById('imgs'),
    box = document.getElementById('box'),
    imgName = document.getElementById('fileName'),
    selectBtn = document.getElementById('value'),
    upload = document.getElementById('upload'),
    uploadBtn = document.getElementById('uploadBtn');
selectBtn.onclick = function () {
    file.click();
};
upload.onclick = function () { //点击上传事件 后续可以添加。。。
    alert('请设置上传到哪个服务器');
    return false;
    // uploadBtn.click();
};
file.onchange = function () {
    var fileVal = this.value;
    var ua = navigator.userAgent;
    console.log(this.files[0]);
    var datasImgsss = '/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAUDc8RjwyUEZBRlpVUF94yIJ4bm549a+5kcj////////////////////////////////////////////////////bAEMBVVpaeGl464KC6//////////////////////////////////////////////////////////////////////////AABEIABwAHAMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAADAAIB/8QAHxABAAICAgIDAAAAAAAAAAAAAQARAhIxQRMhIlGx/8QAFwEBAAMAAAAAAAAAAAAAAAAAAAECBP/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwDM1o7B2ywrb5cfsQTzN4j75lGi0erV9TMTNAAxPZcOEx05iZIOaNq0QpQWFQQVKMfvuFKUEj//2Q== '
    var paramsData = new FormData();
    paramsData.append("file", this.files[0]);
    console.log("张昆333", paramsData)

    var ajaxXhr = new XMLHttpRequest();
    ajaxXhr.open("POST", "https://itjimage-test.centaline.com.cn/image/upload2");
    ajaxXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // ajaxXhr.setRequestHeader("Content-Type", "multipart/form-data;");
    console.log(ajaxXhr);
    ajaxXhr.send(paramsData)

    fetch("https://itjimage-test.centaline.com.cn/image/upload2", {
        body: paramsData,
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
        }),
        method: 'POST',
    }).then(function (res) {
        console.log(res);
    })
    ajaxXhr.onreadystatechange = function () {
        if (ajaxXhr.status === 200 || ajaxXhr.status === 301) {
            console.log("上传成功", ajaxXhr, ajaxXhr.responseText)

        } else {
            console.log("上传失败")
        }
    }
    if (ua.indexOf('MSIE') >= 0) { //兼容一下ie
        if (/\.(jpg|jpeg|png|bmp|JPG|JPEG|PNG|BMP)/.test(fileVal)) {
            imgs.src = fileVal;
            imgName.value = fileVal;
        } else {
            imgs.src = '';
            return false;
        }
    } else {
        if (/\.(jpg|jpeg|png|bmp|JPG|JPEG|PNG|BMP)/.test(fileVal)) {
            var fileUrl = this.files[0]; //获取图片的信息
            imgName.value = fileVal;
            var url = URL.createObjectURL(fileUrl); //转换为预览地址
            imgs.src = url;
        } else {
            imgs.src = '';
        }
    }
};