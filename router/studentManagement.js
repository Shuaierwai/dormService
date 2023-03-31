const express = require("express");

const db = require("../utils/db");

const router = express.Router();

//渲染
router.post("/getStudents", (req, res) => {
  let { search, page, count } = req.body;
  console.log(req.body);
  let sql = ` SELECT s_id,s_name,s_age,s_sex,s_tel,s_num,s_user,s_password,d_dorm.d_num,d_dorm.d_name,d_dorm.d_id,d_dorm.d_state,b_building.b_name,c_class.c_name,a_academy.a_name
  FROM s_student
  JOIN d_dorm ON s_student.s_dorm_id=d_dorm.d_id 
  JOIN b_building ON s_student.s_building_id=b_building.b_id 
  JOIN c_class on s_student.s_class_id=c_class.c_id
  JOIN a_academy on s_student.s_academy_id=a_academy.a_id  
   WHERE  s_num like '%${search}%' LIMIT ${(page - 1) * count},${count * page}
   `;
  //  LIMIT ${(page - 1) * count},${count}
  let sql2 = ` SELECT COUNT(*) 'total' FROM  s_student WHERE s_num like '%${search}%'`;
  console.log(sql, sql2);
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
            msg: "获取学生成功",
            data: data,
            total: data2[0].total,
          });
        }
      });
    }
  });
});

//查询学院和班级个数
router.get("/getAcademy", (req, res) => {
  // let { name, page, count } = req.query;
  let sql = `SELECT COUNT(*) 'academyT' FROM  a_academy`;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({
        code: 200,
        msg: "获取学院成功",
        total: data,
      });
    }
  });
});
// router.get("/getClass", (req, res) => {
//   // let { name, page, count } = req.query;
//   let sql = `SELECT COUNT(*) 'classT' FROM  c_class`;
//   db.query(sql, (err, data) => {
//     if (err) {
//       res.send({ code: 500, msg: err });
//     } else {
//       res.send({
//         code: 200,
//         msg: "获取班级成功",
//         total: data,
//       });
//     }
//   });
// });

router.get("/getSex", (req, res) => {
  // let { name, page, count } = req.query;
  let sql = `SELECT COUNT(*) 'total' FROM  s_student WHERE s_sex='男'`;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({
        code: 200,
        msg: "获取男生人数成功",
        data: data,
      });
    }
  });
});

//获取班级接口
router.get("/getClass", (req, res) => {
  // let {search}=req.query
  let sql = `SELECT * FROM c_class   `;
  let sql2 = `SELECT c_name,COUNT(*) 'classNum' FROM s_student
 JOIN c_class ON s_student.s_class_id = c_class.c_id  GROUP BY c_class.c_name  
 `;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      db.query(sql2, (err2, data2) => {
        if (err2) {
          res.send({ code: 500, msg: err2 });
        } else {
          res.send({
            code: 200,
            msg: "获取班级成功",
            data: data,
            data2: data2,
          });
        }
      });
    }
  });
});
//获取楼宇
router.get("/getBuilding", (req, res) => {
  // let {search}=req.query
  let sql = `SELECT * FROM  b_building   `;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "获取楼宇成功", data: data });
    }
  });
});

router.get("/getAcademyNum", (req, res) => {
  // let {search}=req.query
  let sql = `SELECT * FROM  a_academy`;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "获取学院成功", data: data });
    }
  });
});

//渲染学生页面
// router.get("/getStudentData", (req, res) => {
//   let { name, page, count } = req.query;
//   let sql = `SELECT s_id,s_name,s_num,s_user,s_password,d_dorm.d_name,d_dorm.d_state,d_dorm.d_money,d_dorm.d_num,d_dorm.d_id
//     FROM s_student JOIN d_dorm ON s_student.s_dorm_id = d_dorm.d_id WHERE  s_name = '${name}'`;
//   db.query(sql, (err, data) => {
//     if (err) {
//       res.send({ code: 500, msg: err });
//     } else {
//       res.send({
//         code: 200,
//         msg: "获取学生成功",
//         data: data,
//       });
//     }
//   });
// });
//渲染小程序个人主页
router.get("/getStudentDataMini", (req, res) => {
  let { id } = req.query;
  let sql = `  SELECT s_id,s_name,d_dorm.d_num,d_dorm.d_id,d_dorm.d_money,d_dorm.d_state,b_building.b_name,c_class.c_name,a_academy.a_name
  FROM s_student
  JOIN d_dorm ON s_student.s_dorm_id=d_dorm.d_id 
  JOIN b_building ON s_student.s_building_id=b_building.b_id 
  JOIN c_class on s_student.s_class_id=c_class.c_id
  JOIN a_academy on s_student.s_academy_id=a_academy.a_id 
  WHERE  s_id =${id}`;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({
        code: 200,
        msg: "获取学生信息成功",
        data: data,
      });
    }
  });
});

//学生充值
router.post("/postReChangeStudent", (req, res) => {
  let { date, rechargeInput, id, dormId, money } = req.body;
  let sql = ` INSERT INTO p_pay VALUES(null,'${date}',${rechargeInput},${id})
  ; `;
  //充值添加到宿舍表
  let sql2 = `UPDATE d_dorm SET d_money=d_money+${money} WHERE d_id=${dormId}`;
  console.log(sql2);
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      db.query(sql2, (err2, data2) => {
        if (err2) {
          res.send({ code: 500, msg: err2 });
        } else {
          res.send({ code: 200, msg: "充值成功" });
        }
      });
    }
  });
});

//execl添加
router.post("/postAddExcelStudent", (req, res) => {
  console.log(req.body);
  let value = req.body;

  let sql = `INSERT INTO s_student(s_id,s_name,s_sex,s_age,s_num,s_user,s_password,s_tel,s_dorm_id,s_class_id,s_building_id,s_academy_id)
    VALUES ?; `;
  console.log(sql);
  db.query(sql, [value], (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "添加成功", data: data });
    }
  });
});

//添加学生
router.post("/postAddStudent", (req, res) => {
  let {
    addStudentNum,
    addStudentSex,
    addStudentAge,
    addStudentTel,
    addStudentName,
    addStudentUser,
    addStudentPass,
    dormList,
    classId,
    buildingId,
    academyId,
  } = req.body;
  let sql = `INSERT INTO s_student(s_id,s_name,s_sex,s_age,s_num,s_user,s_password,s_tel,s_dorm_id,s_class_id,s_building_id,s_academy_id)
  VALUES(null,'${addStudentName}','${addStudentSex}','${addStudentAge}','${addStudentNum}','${addStudentUser}','${addStudentPass}','${addStudentTel}',${dormList},${classId},${buildingId},${academyId}); `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "添加成功", data: data });
    }
  });
});

//查找寝室
router.post("/postAddSDorm", (req, res) => {
  let { num } = req.body;
  let sql = ` SELECT * FROM d_dorm WHERE d_name='${num}'`;

  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "查询成功", data: data });
    }
  });
});
//删除
router.post("/postDelStudent", (req, res) => {
  let { id } = req.body;
  let sql = `SET foreign_key_checks = 0 `;
  let sql2 = `DELETE FROM s_student WHERE s_id=${id} `;
  let sql3 = `SET foreign_key_checks = 1`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      db.query(sql2, (err2, data2) => {
        if (err2) {
          res.send({ code: 500, msg: err });
        } else {
          db.query(sql3, (err3, data3) => {
            if (err3) {
              res.send({ code: 500, msg: err });
            } else {
              res.send({ code: 200, msg: "删除成功" });
            }
          });
        }
      });
    }
  });
});
//修改
router.post("/postEditStudent", (req, res) => {
  let {
    id,
    editStudentNum,
    editStudentSex,
    editStudentAge,
    editStudentTel,
    editStudentName,
    editStudentUser,
    editStudentPass,
    dormId,
    classId,
    buildingId,
    academyId,
  } = req.body;
  let sql = ` UPDATE s_student
  SET
  s_name = '${editStudentName}',
  s_sex='${editStudentSex}',s_age='${editStudentAge}',
  s_num='${editStudentNum}',s_user='${editStudentUser}',s_tel='${editStudentTel}',
  s_password='${editStudentPass}',s_dorm_id=${dormId},s_class_id=${classId},
  s_building_id=${buildingId},s_academy_id=${academyId}
WHERE
  s_id = ${id}
    `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "修改成功", data: data });
    }
  });
});
//查看缴费信息
router.get("/getStudentPay", (req, res) => {
  let { count, page, id } = req.query;
  let sql = `SELECT p_date,p_payAmount,s_student.s_id,s_student.s_name
  FROM p_pay JOIN s_student ON p_pay.p_student_id=s_student.s_id WHERE s_student.s_id=${id} LIMIT ${
    (page - 1) * count
  },${count}`;
  let sql2 = `SELECT s_student.s_id,COUNT(*) 'total'
   FROM p_pay JOIN s_student ON p_pay.p_student_id=s_student.s_id WHERE s_student.s_id=${id} `;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      db.query(sql2, (err2, data2) => {
        if (err2) {
          res.send({ code: 500, msg: err2 });
        } else {
          if (data.length > 0) {
            res.send({
              code: 200,
              msg: "查询成功",
              data: data,
              total: data2[0].total,
            });
          } else {
            res.send({ code: 404, msg: "暂无缴费记录" });
          }
        }
      });
    }
  });
});
module.exports = router;
