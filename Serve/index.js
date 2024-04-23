const express = require('express')
var ejs = require('ejs')
var config = require('./config/default')
const path =require("path")
// const config = require("./config");
// // 解析token的中间件
// const expressJWT = require("express-jwt");
// // 使用 unless({ path:[/^\/user\//] )) 指定哪些接口不需要进行 Token 的身份认证
// // ps: path: [/^\/user/] 改成你自己的接口前缀path: [/^\/XXX/] 
// app.use(
//   expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/user/] })
// );

const app = express() 
// 获取静态资源
app.all("*", function (req, res, next) {
    // "/允许访问ip *为所有
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", '3.2.1')
    //这段仅仅为了方便返回ison而已
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method == 'OPTIONS') {
        //让options请求快速返回
        res.sendStatus(280);
    } else {
        next();
    }
})

// app.use(express.static(__dirname + 'views'));
app.use(express.static(path.join(__dirname,'data')))
// 加入html视图
app.engine('html', ejs.__express)
app.set('view engine', 'html')
// 解析前端数据
app.use(express.json());
// 解析客户端传递过来的urlencoded
app.use(express.urlencoded({ extended: true }));
// 引用路由
require('./routes/index')(app)
require('./routes/files')(app)
// 监听端口
app.listen(config.port, () => {
    console.log(`我监听了端口${config.port}`);
})

