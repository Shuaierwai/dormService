//导入express模块
const express = require("express");
// const favicon = require("serve-favicon");
//配置日志
const morgan = require("morgan");

//塔建服务器
const serve = express();
//解决跨域
const cors = require('cors')

//const session = require('express-session')

//塔建路由
const loginRouter=require('./router/login');
const filesRouter=require('./router/files');
const payRouter=require('./router/pay');//支付路由
const maintenanceRouter=require('./router/maintenance');//上报维修
const announcementRouter=require('./router/announcement')
const dormRouter=require('./router/dorm')
const studentManagementRouter=require('./router/studentManagement')
const studentRouter=require('./router/studentManagement')
const noticeRouter=require('./router/notice')
const superAdminRouter=require('./router/superAdmin')
//使用
 serve.use(cors())
//配置静态页面访问路径
serve.use(express.static("./public"));
// serve.use(favicon("./public/tp.ico"));
//配置post
serve.use(express.json());
serve.use(express.urlencoded({ extended: false }));
serve.use(morgan("dev"));

// serve.use(session({
//     secret: 'web312',
//     resave: false,
//     rolling:true,
//     cookie: { maxAge: 30000 }
//   }))

//   serve.all('*',(req,res,next)=>{
//     console.log(req.path)
//       if(req.session.user ||req.path=='/login' ){
//          next()
//       }else{
//         res.send({code:501,msg:'session过期'})
//       }
//   })
//使用路由
serve.use(loginRouter)
serve.use(filesRouter)
serve.use(payRouter)
serve.use(maintenanceRouter)
serve.use(announcementRouter)
serve.use(dormRouter)
serve.use(studentManagementRouter)
serve.use(noticeRouter)
serve.use(superAdminRouter)
serve.use(studentRouter)

serve.listen(8880);
