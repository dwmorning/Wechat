let mysql = require('mysql');
let config = require('../db/db');
let connection = mysql.createConnection(config);
var ws = require("nodejs-websocket")

/*引用模块*/
var express = require('express');
var app = express();
var url = require('url');//url模块,对url格式的字符串进行解析，返回一个对象。根据不同的url进行处理，返回不同的数据。

app.all('*',function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');//*表示可以跨域任何域名都行（包括直接存在本地的html文件）出于安全考虑最好只设置 你信任的来源也可以填域名表示只接受某个域名
    res.header('Access-Control-Allow-Headers','X-Requested-With,Content-Type');//可以支持的消息首部列表
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');//可以支持的提交方式
    res.header('Content-Type','application/json;charset=utf-8');//响应头中定义的类型
    next();
});
app.get('/get',function(req,res){

    console.log(req.query)

    Province = req.query.province
    Year = req.query.year;
    Batch = req.query.batch;
    Division = req.query.division


    connection.query(`SELECT *  FROM admission where Province ='${Province}' and Year='${Year}' and Batch='${Batch}' and Division='${Division}'`, (error, results, fields) => {
        //  '${province}' and Year = '${year}' and Batch = '${batch} and Class = '${classs}'
        if (error) {
            return console.error(error.message);
        }
        //console.log(results);
        var string = JSON.stringify(results);
        var data = JSON.parse(string)
        console.log(data);
        res.send(data)


    })

});
var server = app.listen(8002, function(){//监听3000端口

    var port = server.address().port;

    console.log('Example app listening on port:%s',port);
});
