//引入expess模块
const express = require('express');
//引入sha1模块
const sha1 = require('sha1');
var path = require("path");
//引入body-parser模块
const bodyParser = require('body-parser');
//引入auth模块

const auth = require('./wechat/auth');
//引入wechat模块
const Wechat = require('./wechat/wechat')
//引入config模块
const {url}= require('./config/index');

const html=require('html');
const historyservice=require('./service/historyservice');
const planservice=require('./service/planservice');
//const accessToken = require('./wechat/accessToken');
//创建app应用对象
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
//配置模板资源目录
// app.set('views','./views');
//配置模板引擎
app.set('view engine','html');
//创建实例对象
const wechatApi = new Wechat();
//页面路由

// app.get('/search',async(req,res)=> {
//     /*
//         生成js-sdk使用的签名
//             1.组合参与签名的四个参数：jsapi(临时票据)，noncestr(随机字符串)，timestamp(时间戳)，url(当前服务器地址)
//             2.将其进行字典序排序，以“&”拼接在一起
//             3.进行sha1加密，最终生成signature
//      */
//     //获取随机字符串
//     const noncestr = Math.random().toString().split('.')[1];
//     //时间戳
//     const timestamp = Date.now();
//     //获取票据
//     const {ticket} =await wechatApi.fetchJsapiTicket ();
//     //1.组合参与签名的四个参数：jsapi_ticket(临时票据)，noncestr(随机字符串)，timestamp(时间戳)，url(当前服务器地址)
//     const arr =[
//         `jsapi_ticket=${ticket}`,
//         `noncestr=${noncestr}`,
//         `timestamp=${timestamp}`,
//         `url=${url}/search`
//     ]
//     //2.将其进行字典序排序，以“&”拼接在一起
//     const str = arr.sort().join('&');
//     console.log(str);
//     //3.进行sha1加密，最终生成signature
//     const signature = sha1(str);
//     //渲染页面，将渲染的页面返回服务器
//     res.render('search',{
//         signature,
//         noncestr,
//         timestamp
//     });
// })
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/public',express.static('public'));
app.get('/plan',async(req,res)=> {
    res.sendFile('plan.html', { root:'./public'});

})
app.get('/history',async(req,res)=> {
    res.sendFile('history.html', { root:'./public'});


})
app.get('/subject',async(req,res)=> {
    res.sendFile('subject.html', { root:'./public'});
})



//接受处理所有消息
app.use(auth());


//监听端口号
app.listen(3000,() =>console.log('服务器启动成功了'));


