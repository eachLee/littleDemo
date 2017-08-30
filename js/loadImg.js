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