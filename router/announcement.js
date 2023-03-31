const express=require('express');

const db=require('../utils/db');

const router=express.Router();

//获取数据
router.get('/getData',(req,res)=>{
    let {count,page}=req.query
    let sql=`SELECT * FROM n_notice  LIMIT ${(page-1)*count},${count}`;
    let sql2=`SELECT COUNT(*) 'total' FROM  n_notice`

    db.query(sql,(err,data)=>{
        if(err){
           res.send({code:500,msg:err})
        }else{
            db.query(sql2,(err2,data2)=>{
               if(err2){
                res.send({code:500,msg:err2})

               }else{
                res.send({code:200,msg:'获取数据成功',data:data,total:data2[0].total})
               }
            })
        }
    })
})
//获取寝室余额
router.post('/postDormMoney',(req,res)=>{
    let {id}=req.body;
    let sql=`SELECT * FROM d_dorm WHERE d_id=${id}`
    db.query(sql,(err,data)=>{
        if(err){
           res.send({code:500,msg:err})
        }else{
          res.send({code:200,msg:'获取宿舍余额成功',data:data})
        }
    })
})


module.exports=router;