const {url} = require('../config');
//menu为创建自定义菜单的具体内容，也就是post到微信服务器的body
module.exports = {
    "button" : [{
        "name" : "信息查询",
        "sub_button" : [{
            "type" : "view",
            "name" : "成信大专业",
            "key" : "V1001_MY_ACCOUNT",
            "url":`${url}/subject`
        }, {
            "type" : "view",
            "name" : "招生计划",
            "key" : "V1002_BID_PROJECTS",
            "url" : `${url}/plan`
        }, {
            "type" : "view",
            "name" : "历史数据",
            "key" : "V1003_RETURN_PLAN",
            "url" : `${url}/history`
        }
        ]
    }, {

        "type" : "view",
        "name" : "百度一下",
        "url" : "https://baike.baidu.com/item/%E6%88%90%E9%83%BD%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6/4743774?fromtitle=%E6%88%90%E9%83%BD%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%AD%A6%E9%99%A2&fromid=158025"

    }
    ]
};

