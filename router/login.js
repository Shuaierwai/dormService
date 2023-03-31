const express = require("express");

const db = require("../utils/db");
const jwt = require("jsonwebtoken");
const request = require("request"); //用于服务器端发送请求的模块
const router = express.Router();

router.post("/login", (req, res) => {
  let { userName, password } = req.body;
  let sql;
  console.log(req.body);
  //表示管理员
  sql = `SELECT * FROM u_user WHERE u_user='${userName}'  AND u_password='${password}'
        `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      let power = [];
      if (data.length > 0) {
        // //req.session.user=JSON.stringify(data[0])
        console.log(data);
        power = [
          {
            path: "/container/workHome",
            icon: "el-icon-s-unfold",
            title: "主页",
            name: "workHome",
            component: "WorkHome",
          },
          {
            path: "/container/student",
            title: "学生管理",
            icon: "el-icon-s-custom",
            name: "student",
            component: "Student",
          },
          {
            path: "/container/dormitoryManagement",
            title: "寝室管理",
            icon: "el-icon-s-home",
            name: "dormitoryManagement",
            component: "DormitoryManagement",
          },
          {
            path: "/container/notice",
            title: "公告管理",
            icon: "el-icon-s-order",
            name: "notice",
            component: "Notice",
          },
          {
            path: "/container/payment",
            title: "缴费记录管理",
            icon: "el-icon-s-claim",
            name: "payment",
            component: "Payment",
          },
          {
            path: "/container/maintenance",
            title: "维修记录管理",
            icon: "el-icon-s-cooperation",
            name: "maintenance",
            component: "Maintenance",
          },
          {
            path: "/container/carousel",
            title: "轮播图管理",
            icon: "el-icon-picture",
            name: "carousel",
            component: "Carousel",
          },
          {
            path: "/container/personalInformation",
            title: "个人信息管理",
            icon: "el-icon-user-solid",
            name: "personalInformation",
            component: "PersonalInformation",
          },
        ];
        if (data[0].u_type == 0) {
          power.push({
            path: "/container/admin",
            title: "宿管管理",
            icon: "el-icon-s-tools",
            component: "Admin",
            name: "admin",
          });
        }
        // console.log(data);
        res.send({
          code: 200,
          msg: "登录成功",
          data: data,
          token: jwt.sign({ data: data[0] }, "dormitory", { expiresIn: "2h" }),
          power: power,
        });
      } else {
        res.send({ code: 404, msg: "登录错误", data: data });
      }
    }
  });
});

//小程序登录
router.get("/loginXcx", (req, res) => {
  let { userName, password } = req.query;
  let sql;
  //表示学生
  sql = `
    SELECT s_id,s_name,d_dorm.d_num,d_dorm.d_id,d_dorm.d_money,d_dorm.d_state,b_building.b_name,c_class.c_name,a_academy.a_name
    FROM s_student
    JOIN d_dorm ON s_student.s_dorm_id=d_dorm.d_id 
    JOIN b_building ON s_student.s_building_id=b_building.b_id 
    JOIN c_class on s_student.s_class_id=c_class.c_id
    JOIN a_academy on s_student.s_academy_id=a_academy.a_id
     WHERE s_user='${userName}' AND s_password='${password}'
      `;
  //  SELECT * FROM s_student WHERE s_user='${userName}'  AND s_password='${password}'
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      if (data.length > 0) {
        res.send({
          code: 200,
          msg: "登录成功",
          data: data,
        });
      } else {
        res.send({
          code: 401,
          msg: "密码或账号错误",
        });
      }
    }
  });
});

//微信小程序登录 /login/wxlogin
router.get("/wxlogin", function (req, res, next) {
  let code = req.query.code; //登陆传过来的code
  // let nickName=req.body.nickName;
  // let avatarUrl=req.body.avatarUrl;
  let appid = "wx8790810d46b62a7b"; //自己小程序后台管理的appid，可登录小程序后台查看
  let mysecret = "31c023d1d7dd613215a1e22b3df94d8d"; //小程序秘钥 小程序后台管理的secret，可登录小程序后台查看
  let grant_type = "authorization_code"; // 授权（必填）默认值
  let url =
    "https://api.weixin.qq.com/sns/jscode2session?appid=" +
    appid +
    "&secret=" +
    mysecret +
    "&js_code=" +
    code +
    "&grant_type=authorization_code";
  request(url, (error, response, body) => {
    console.log("error", error);
    console.log("response", response);
    console.log("body", body);

    //
    //......
    res.json({
      code: 200,
      msg: "登录成功",
      data: {
        openid: body.openid,
        touxiang: "1.jpg",
        nicheng: "昵称",
      },
    });
  });
});

module.exports = router;
