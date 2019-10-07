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
const menu = require('./wechat/menu');
const html=require('html');
const historyservice=require('./service/historyservice');
const planservice=require('./service/planservice');
//const accessToken = require('./wechat/accessToken');
//创建app应用对象
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
//配置模板资源目录
// app.set('views','./views');
//配置模板引擎
app.set('view engine','html');
//创建实例对象
const wechatApi = new Wechat();
//页面路由
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


