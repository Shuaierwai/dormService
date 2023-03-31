const express = require("express");

const db = require("../utils/db");

const router = express.Router();

router.post("/getDorm", (req, res) => {
  let { search, count, page } = req.body;
  let sql = `SELECT * FROM d_dorm`;
  let sql2 = `SELECT * FROM d_dorm WHERE d_name LIKE '%${search}%' LIMIT ${
    (page - 1) * count
  },${page * count} `;
  let sql3 = `SELECT d_num,COUNT(*) 'studentNum' FROM s_student
    JOIN d_dorm ON s_student.s_dorm_id = d_dorm.d_id  GROUP BY d_dorm.d_num   
    `;
  console.log(sql);
  console.log(sql2);
  console.log(sql3);
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      db.query(sql2, (err2, data2) => {
        if (err2) {
          res.send({ code: 500, msg: err2 });
        } else {
          db.query(sql3, (err3, data3) => {
            if (err3) {
              res.send({ code: 500, msg: err3 });
            }else{
                res.send({code:200,msg:'获取寝室成功',data:data,data2:data2,data3:data3})
            }
          });
        }
      });
    }
  });
});

//小程序查寝室金额
router.get("/getDormMoney", (req, res) => {
  let { id } = req.query;
  let sql = ` SELECT d_money FROM d_dorm WHERE d_id=${id}`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "查询寝室余额成功", data: data });
    }
  });
});

//添加
router.post("/postAddDorm", (req, res) => {
  let { addDormNum, addDormName, addDormPay } = req.body;
  let sql = `INSERT INTO d_dorm VALUES
    (null,'${addDormNum}','${addDormName}',${addDormPay},1) `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "添加成功" });
    }
  });
});

//修改  ,d_money=${editDormPay} editDormPay, editDormPeople,editDormNum
router.post("/postEditDorm", (req, res) => {
  let {editDormName,  id } = req.body;
  let sql = `UPDATE d_dorm SET d_name='${editDormName}'  WHERE d_id=${id}`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "修改成功" });
    }
  });
});
//删除
router.post("/postDelDorm", (req, res) => {
  let { id } = req.body;
  let sql = `DELETE FROM d_dorm WHERE d_id=${id}`;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "删除成功" });
    }
  });
});
module.exports = router;
