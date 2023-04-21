let express = require('express')
let router = express.Router()
const db = require("../utils/db");

const alipaySdk = require('../utils/alipayUtil.js');
const AlipayFormData = require('alipay-sdk/lib/form').default;

//支付接口
router.post('/pay', function (req, res) {
    console.log('req', req.body.orderId);
    let {payDate,id,dormId,student}=req.body
    let orderId = req.body.orderId
    let price = req.body.price
   
    let sql = ` INSERT INTO p_pay VALUES(null,'${payDate}',${price},'${student}',${id})
  ; `;
  //充值添加到宿舍表
  let sql2=`UPDATE d_dorm SET d_money=d_money+${price} WHERE d_id=${dormId}`
  console.log(sql,sql2)
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      db.query(sql2,(err2,data2)=>{
        if(err2){
          res.send({code:500,msg:err2})
        }else{
          res.send({ code: 200, msg: "充值成功" });

        }
      })
    }
  });
    // * 添加购物车支付支付宝 */
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    // const formData = new AlipayFormData();
    // formData.setMethod('get');
    // // 通过 addField 增加参数
    // // 在用户支付完成之后，支付宝服务器会根据传入的 notify_url，以 POST 请求的形式将支付结果作为参数通知到商户系统。
    // formData.addField('returnUrl', 'http://localhost:8080/'); // 支付成功回调地址，必须为可以直接访问的地址，不能带参数
    // formData.addField('bizContent', {
    //     outTradeNo: orderId, // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
    //     productCode: 'FAST_INSTANT_TRADE_PAY', // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
    //     totalAmount: price, // 订单总金额，单位为元，精确到小数点后两位
    //     subject: '商品', // 订单标题
    //     body: '商品详情', // 订单描述
    // });
    // // formData.addField('returnUrl', 'https://opendocs.alipay.com');//加在这里才有效果,不是加在bizContent 里面
    // // 如果需要支付后跳转到商户界面，可以增加属性"returnUrl"

    // console.log('----------------------alipaySdkalipaySdk,,',alipaySdk);
    // const result =  alipaySdk.exec(  // result 为可以跳转到支付链接的 url
    //     'alipay.trade.page.pay', // 统一收单下单并支付页面接口
    //     {}, // api 请求的参数（包含“公共请求参数”和“业务参数”）
    //     { formData: formData },
    // );

    // // alipaySdk.exec('alipay.system.oauth.token', {
    // //     grantType: 'authorization_code',
    // //     code: 'code',
    // //     refreshToken: 'token'
    // // })
    // // .then(result => {
    // //     console.log(result);
    // // })
    // // .catch(err => {
    // //     console.log(err);
    // // })

    // result.then((resp) => {
    //     console.log(resp)
    //     res.send(
    //         {
    //             "success": true,
    //             "message": "success",
    //             "code": 200,
    //             "timestamp": (new Date()).getTime(),
    //             "result": resp
    //         }
    //     )
    // })
})

//后台展示缴费记录信息
router.get('/getPay',(req,res)=>{
  let { count, page,search}=req.query;
  let sql=`SELECT * FROM p_pay WHERE p_student  like '%${search}%' LIMIT ${(page-1)*count},${count}`;
  let sql2=`SELECT COUNT(*) 'total' FROM p_pay WHERE  p_student like '%${search}%'`;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      db.query(sql2, (err2, data2) => {
        if (err2) {
          res.send({ code: 500, msg: err2 });
        }else{
          if(data.length>0){
              res.send({code:200,msg:'获取缴费信息成功',data:data,total:data2[0].total})
          }else{
              res.send({code:404,msg:'查无此数据'})
          } 
        }
      });
    }
  });
})

//删除缴费信息
router.get("/getDelPay", (req, res) => {
  let { id } = req.query;
  let sql = ` DELETE FROM p_pay WHERE p_id=${id}
    `;
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err });
    } else {
      res.send({ code: 200, msg: "删除成功" });
    }
  });
});

//查询小程序支付记录
router.get("/getStudentPayMini", (req, res) => {
    let { count, page, id } = req.query;
    let sql = `SELECT p_date,p_payAmount,s_student.s_id,s_student.s_name
    FROM p_pay JOIN s_student ON p_pay.p_student_id=s_student.s_id WHERE s_student.s_id=${id} LIMIT ${
      (page - 1) * count
    },${count*page}`;
    let sql2 = `SELECT s_student.s_id,COUNT(*) 'total'
     FROM p_pay JOIN s_student ON p_pay.p_student_id=s_student.s_id WHERE s_student.s_id=${id} `;
     console.log(sql)
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
            }
          }
        });
      }
    });
  });

module.exports = router