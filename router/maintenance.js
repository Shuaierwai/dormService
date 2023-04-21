const express=require('express');

const db=require('../utils/db');

const router=express.Router();
//小程序端
router.get("/getMaintenanceMini", (req, res) => {
    let { count, page,id } = req.query;
    let sql = `SELECT m_id,m_time,m_state,m_content,s_student.s_id
    FROM m_maintenance JOIN s_student ON m_student_id=s_student.s_id WHERE s_student.s_id=${id} LIMIT ${
      (page - 1) * count
    },${count}
    
      `;
    let sql2 = `SELECT COUNT(*) 'total'
    FROM m_maintenance JOIN s_student ON m_maintenance.m_student_id=s_student.s_id WHERE s_student.s_id=${id} 
      `;
      console.log(sql);
    db.query(sql, (err, data) => {
      if (err) {
        res.send({ code: 500, msg: err });
      } else {
        db.query(sql2, (err2, data2) => {
          if (err2) {
            res.send({ code: 500, msg: err });
          } else {
            res.send({
              code: 200,
              msg: "获取维修记录成功",
              data: data,
              total: data2[0].total,
            });
          }
        });
      }
    });
  });

  //web端 数据的渲染
  router.get("/getMaintenance", (req, res) => {
    let { count, page,search } = req.query;
    let sql = `SELECT m_id,m_time,m_state,m_content,m_imgUrl,s_student.s_id,s_student.s_name
    FROM m_maintenance JOIN s_student ON m_student_id=s_student.s_id WHERE m_maintenance.m_content LIKE '%${search}%' LIMIT ${
      (page - 1) * count
    },${count}
    
      `;
    let sql2 = `SELECT COUNT(*) 'total'
    FROM m_maintenance JOIN s_student ON m_maintenance.m_student_id=s_student.s_id WHERE m_maintenance.m_content LIKE '%${search}%'
      `;
      console.log(sql);
    db.query(sql, (err, data) => {
      if (err) {
        res.send({ code: 500, msg: err });
      } else {
        db.query(sql2, (err2, data2) => {
          if (err2) {
            res.send({ code: 500, msg: err });
          } else {
            res.send({
              code: 200,
              msg: "获取维修记录成功",
              data: data,
              total: data2[0].total,
            });
          }
        });
      }
    });
  });

  //编辑维修管理
  router.post("/postEditMain", (req, res) => {
    let { editState, id } = req.body;
    let sql = ` UPDATE m_maintenance SET m_state='${editState}' WHERE m_id=${id}`;
    db.query(sql, (err, data) => {
      if (err) {
        res.send({ code: 500, msg: err });
      } else {
        res.send({ code: 200, msg: "修改成功" });
      }
    });
  });
  //查询未处理的维修
  router.get("/getUndisposedMain", (req, res) => {

    let sql = `SELECT COUNT(*) 'total' FROM m_maintenance WHERE m_state=0`;
    db.query(sql, (err, data) => {
      if (err) {
        res.send({ code: 500, msg: err });
      } else {
        res.send({ code: 200, msg: "未处理查询成功" ,data:data});
      }
    });
  });

  //删除
  router.get("/getDelMain", (req, res) => {
    let { id } = req.query;
    let sql = ` DELETE FROM m_maintenance WHERE m_id=${id}
      `;
    db.query(sql, (err, data) => {
      if (err) {
        res.send({ code: 500, msg: err });
      } else {
        res.send({ code: 200, msg: "删除成功" });
      }
    });
  });


module.exports = router;