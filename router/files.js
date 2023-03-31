const express = require('express');
const router = express.Router();
const fs = require('fs');  //可以读写、删除文件的模块
const db = require('../utils/db');

//引入配置文件
const upload = require("../utils/uploadconfig");

//上传维修
router.post("/UploadRepairs", upload.single("myfile"), function (req, res) {
	//再这里 req.file 一旦有这个文件了，就说明上传已经成功了,也可以将文件名存在数据库里面，后续再去查找
	console.log('res.file', req.file);
    console.log('req 数据',req.body);
    let {context,repairTime,studentId}=req.body
    let fileName = '/images/' + req.file.filename
    let sql=` INSERT INTO m_maintenance VALUES (NULL,'${context}','${fileName}','${repairTime}',DEFAULT, ${studentId})`
	db.query(sql,(err,data)=>{
        if(err){
         res.send({code:500,msg:err})
        }else{
            res.send({code:200,msg:'上传图片成功'})
        }
    })
});

module.exports = router;