var https = require('https');
var request = require('request');
var Promise = require('promise');  //promise用于流程控制，即保证先获取到access_token,在调用创建自定义菜单接口

var appId = 'wx3e0ac5bde7ae7875'; //记得换成你自己测试号的信息
var appSecret = 'f40adca8c199db9e69c40dc476662c55';

function getToKen(appId, appSecret) {

    return new Promise(function (resolve, reject) {

        var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appId + '&secret=' + appSecret;
        request({
            uri : url
        }, function (err, res, data) {
            var result = JSON.parse(data);
            console.log("result.access_token=", result);

            resolve(result.access_token);  //把获取的access_token返回去
        });

    });

}

//menu为创建自定义菜单的具体内容，也就是post到微信服务器的body
var menu = {
    "button" : [{
        "name" : "信息查询",
        "sub_button" : [{
            "type" : "view",
            "name" : "成信大专业",
            "key" : "V1001_MY_ACCOUNT",
            "url" : "http://localhost:3000/subject"
        }, {
            "type" : "view",
            "name" : "招生计划",
            "key" : "V1002_BID_PROJECTS",
            "url" : "http://localhost:3000/plan"
        }, {
            "type" : "view",
            "name" : "历史数据",
            "key" : "V1003_RETURN_PLAN",
            "url" : "http://localhost:3000/history"
        }
        ]
    }, {

        "type" : "view",
        "name" : "百度一下",
        "url" : "https://baike.baidu.com/item/%E6%88%90%E9%83%BD%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6/4743774?fromtitle=%E6%88%90%E9%83%BD%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%AD%A6%E9%99%A2&fromid=158025"

    }
    ]
};

var post_str = new Buffer.from(JSON.stringify(menu));   //先将menu转成JSON数据格式，在赋给post_srt数组

//console.log("JSON.stringify(menu)=", JSON.stringify(menu));
//console.log("post_str.toString()=", post_str.toString());
//console.log("post_str.length", post_str.length);


//调用getToken函数，getToken函数执行完，接下来才执行then函数中的匿名函数,其中，access_token为返回来的参数。
//对promise控制流程的原理操作不熟悉的家伙，请移步度娘，这个技术特别重要！尤其是在基于事件、异步IO的nodejs中，很多时候， 代码的执行顺序并非顺序执行，所以很有必要控制代码的流程。

getToKen(appId, appSecret).then(function (access_token){
    var post_options = {
        host : 'api.weixin.qq.com',
        port : '443',
        path : '/cgi-bin/menu/create?access_token=' + access_token,
        method : 'POST',
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length' : post_str.length
        }
    };

    var post_req = https.request(post_options, function (response) {
        var responseText = [];
        var size = 0;
        response.setEncoding('utf8');
        response.on('data', function (data) {
            responseText.push(data);
            size += data.length;
        });
        response.on('end', function () {
            console.log("responseText=", responseText);
        });
    });

    post_req.write(post_str);   // 把menu数据post到微信服务器，剩下的微信自动帮我们搞定了。
    post_req.end();
});
module.exports =getToKen;

