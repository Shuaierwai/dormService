const express = require("express");

const db = require("../utils/db");

const router = express.Router();

//渲染
router.post("/getAdmin", (req, res) => {
    let { count, page, search } = req.body;
    let sql = `SELECT * FROM u_user WHERE  u_name like '%${search}%' LIMIT ${(page-1)*count},${count}
      `;
    let sql2 = `SELECT COUNT(*) 'total' FROM u_user WHERE  u_name like '%${search}%' 
      `;
      console.log(sql,sql2);
    db.query(sql, (err, data) => {
      if (err) {
        res.send({ code: 500, msg: err });
      } else {
        db.query(sql2, (err2, data2) => {
          if (err2) {
            res.send({ code: 500, msg: err });
          }else{
            if(data.length>0){
                res.send({code:200,msg:'获取管理员成功',data:data,total:data2[0].total})
            }else{
                res.send({code:404,msg:'查无此数据'})
            }
             
          }
        });
      }
    });
  });
//查询管理员信息
router.get('/getAdminInfo',(req,res)=>{
  let {id}=req.query
  let sql=`SELECT * FROM u_user WHERE u_id=${id}`
  db.query(sql,(err,data)=>{
      if(err){
        res.send({code:500,msg:err})
      }else{
          res.send({code:200,data:data,msg:'查询成功'})
      }
  })
})


//渲染本人管理员
router.get('/getAdminData',(req,res)=>{
  let {id,count,page}=req.query;
  let sql=`SELECT * FROM u_user WHERE u_id=${id}  LIMIT ${(page-1)*count},${count}`
  let sql2 = `SELECT COUNT(*) 'total' FROM u_user WHERE  u_id ='${id}' 
  `;
  db.query(sql,(err,data)=>{
    if(err){
     res.send({code:500,msg:err})
    }else{
      db.query(sql2,(err2,data2)=>{
        if(err2){
          res.send({code:500,msg:err2}) 
        }else{
          res.send({code:200,msg:'获取管理员成功',data:data,total:data2[0].total})
        }
      })
     
    }
  })
})
//添加
router.post('/postAddAdmin',(req,res)=>{
    let {addAdminName,addAdminUser,addAdminPass,addAdminTel, addAdminType}=req.body;
    let sql=`INSERT INTO u_user VALUES(null,'${addAdminName}','${addAdminTel}','${addAdminUser}','${addAdminPass}',${addAdminType})`
    db.query(sql,(err,data)=>{
      if(err){
        res.send({code:500,msg:err})
      }else{
        res.send({code:200,msg:'添加成功'})
      }
    })
})
//删除
router.get('/getDelAdmin',(req,res)=>{
  let {id}=req.query
  let sql=` DELETE FROM u_user WHERE u_id=${id}
  `
  db.query(sql,(err,data)=>{
      if(err){
        res.send({code:500,msg:err})
      }else{
          res.send({code:200,msg:'删除成功'})
      }
  })
})
//修改
router.post('/postEditAdmin',(req,res)=>{
  let {editAdminName,editAdminPass,editTel,id}=req.body;
  let sql=`  UPDATE u_user SET u_name='${editAdminName}',u_password='${editAdminPass}',u_tel='${editTel}' WHERE u_id=${id}
  `
  db.query(sql,(err,data)=>{
    if(err){
      res.send({code:500,msg:err})
    }else{
        res.send({code:200,msg:'修改成功'})
    }
})
})
module.exports=router