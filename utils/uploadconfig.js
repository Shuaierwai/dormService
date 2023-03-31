const multer = require("multer");
const storage = multer.diskStorage({
	//配置上传的文件放到哪里去
	destination: function (req, file, cb) {
		//指定文件保存路径
		cb(null, "./public/images");

	},
	//重命名上传的文件  
	filename: function (req, file, cb) {
		console.log('file',file);
		let fileName = file.originalname
		let index = fileName.lastIndexOf('.') //取到最后一个点的位置
		let str = fileName.slice(0,index) + '-' + Date.now() + fileName.slice(index,fileName.length)
		//通过回调函数为上传的文件重命名
		// console.log('str',str);
		cb(null, str);
	}
});

//公开配置
const upload = multer({
	storage: storage
});
module.exports = upload;