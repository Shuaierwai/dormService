const mysql=require('mysql')

const db=mysql.createPool({
    host     : 'sh-cynosdbmysql-grp-l20cvnqu.sql.tencentcdb.com',
    user     : 'root',
    password : 'Liushuai0628',
    port:22040,
    database : 'universitydormitorymanagent',
    
})
// process.on('uncaughtException',function(err){
//     if(err.code == "PROTOCOL_CONNECTION_LOST"){ 
//         mysql.restart();
//     }
// });

// const db=mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'root',
//     database : 'universitydormitorymanagement'
// })
module.exports=db
