const express = require("express");

const db = require("../utils/db");

const router = express.Router();
//web端
router.post("/getNotice", (req, res) => {
  let { count, page, search } = req.body;
  let sql = ` SELECT n_id, n_num,n_title,n_content,n_date,u_user.u_name
  FROM n_notice JOIN u_user ON n_notice.n_user_id=u_user.u_id WHERE n_num like '%${search}%' ORDER BY n_date desc LIMIT ${
    (page - 1) * count
  },${count}
  
    `;
  let sql2 = `SELECT COUNT(*) 'total' FROM n_notice WHERE  n_num like '%${search}%' 
    `;
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
            msg: "获取公告成功",
            data: data,
            total: data2[0].total,
          });
        }
      });
    }
  });
});

//小程序端
router.get("/getNoticeMini", (req, res) => {
  let { count, page } = req.query;
  let sql = `SELECT n_id, n_num,n_title,n_content,n_date,u_user.u_name
  FROM n_notice JOIN u_user ON n_notice.n_user_id=u_user.u_id LIMIT ${
    (page - 1) * count
  },${count*page}`;
  let sql2 = `SELECT COUNT(*) 'total' FROM n_notice WHERE  n_num`;
  console.log(sql)
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
            msg: "获取公告成功",
            data: data,
            total: data2[0].total,
          });
        }
      });
    }
  });
});
//添加
router.post("/postAddNotice", (req, res) => {
  let {
    addNoticeNum,
    addNoticeContent,
    addUser,
    addNoticeTitle,
    addNoticeDate,
  } = req.body;
  let sql = `INSERT INTO n_notice VALUES
    (null,'${addNoticeNum}','${addNoticeTitle}','${addNoticeContent}','${addNoticeDate}',${addUser})`;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "添加成功" });
    }
  });
});
//删除
router.post("/postDelNotice", (req, res) => {
  let { id } = req.body;
  let sql = ` DELETE FROM n_notice WHERE n_id=${id}
    `;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "删除成功" });
    }
  });
});
//修改
router.post("/postEditNotice", (req, res) => {
  let { editNoticeContent, editNoticeTitle, id } = req.body;
  let sql = ` UPDATE n_notice SET n_title='${editNoticeTitle}',n_content='${editNoticeContent}' WHERE n_id=${id}`;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "修改成功" });
    }
  });
});
module.exports = router;
