/*
  验证服务器的有效性:

    1、填写服务器配置(测试号管理页面)
      - URL 开发者服务器地址（保证能在互联网中能访问）
        通过 ngrok http 端口号 就得到一个网址
      - Token  参与微信签名的加密
    2、验证服务器地址的有效性
      - 将timestamp、nonce、token三个参数按照字典序排序
      - 将三个参数拼接在一起，进行sha1加密
      - 将加密后生成字符串和微信签名进行对比，
            如果相同说明成功，返回一个echostr给微信服务器，
            如果不相同，说明签名算法出了问题，配置不成功
 */
//引入配置对象
const config = require('../config');
//引入sha1加密模块
const sha1 = require('sha1');
//引入工具函数
const {getUserDataAsync, parseXMLAsync, formatMessage} = require('../libs/utils');
//引入reply模块
const reply = require('./reply');

module.exports = () => {

    return async (req, res, next) => {
        //接受微信服务器发送过来的请求参数
        // console.log(req.query);
        /*
          { signature: 'c4409bdd012bf28d8b4aabf7ac5847c5560d6cf0',   微信的加密签名（timestamp、nonce、token）
            echostr: '11283286178012191741',  随机字符串
            timestamp: '1529977721',          时间戳
            nonce: '1462949582' }             随机数字
         */
        //获取参与加密的参数
        const {signature, echostr, timestamp, nonce} = req.query;
        const {token} = config;
        /*// - 将timestamp、nonce、token三个参数按照字典序排序
        const arr = [timestamp, nonce, token].sort();
        // - 将三个参数拼接在一起，进行sha1加密
        const str = arr.join('');
        const sha1Str = sha1(str);*/
        //简写方式
        const sha1Str = sha1([timestamp, nonce, token].sort().join(''));

        /*
          微信服务器会主动发送两种方法的消息
            GET请求， 验证服务器有效性
            POST请求，微信服务器会将用户发送过来的消息转发到开发者服务器上
         */
        if (req.method === 'GET') {
            // - 将加密后生成字符串和微信签名进行对比，
            if (sha1Str === signature) {
                //说明成功，返回echostr给微信服务器
                res.send(echostr);
            } else {
                //说明失败
                res.send('');
            }
        } else if (req.method === 'POST') {
            //接受用户发送过来消息
            // console.log(req.query);
            /*
              { signature: 'c67250097842aa50990259fa3df052eeffcb1cee',
                timestamp: '1530000513',
                nonce: '53405765',
                openid: 'oAsoR1iP-_D3LZIwNCnK8BFotmJc' }  //用户的id
             */
            //验证消息是否来自于微信服务器
            if (sha1Str !== signature) {
                //说明消息不是来自于微信服务器
                //过滤掉非法请求
                res.send('error');
                return
            }

            //获取用户的消息，返回的数据格式是xml
            const xmlData = await getUserDataAsync(req);
            // console.log(xmlData);
            /*
              <xml>
                <ToUserName><![CDATA[gh_4fe7faab4d6c]]></ToUserName>   //开发者的id
                <FromUserName><![CDATA[oAsoR1iP-_D3LZIwNCnK8BFotmJc]]></FromUserName>  //用户的openid
                <CreateTime>1530001191</CreateTime>   //消息发送时间
                <MsgType><![CDATA[text]]></MsgType>   //消息的类型
                <Content><![CDATA[666]]></Content>    //消息的具体内容
                <MsgId>6571305078611302153</MsgId>    //消息的id
              </xml>
             */
            //将xml解析成js对象
            const jsData = await parseXMLAsync(xmlData);
            // console.log(jsData);
            /*
              { xml:
               { ToUserName: [ 'gh_4fe7faab4d6c' ],
                 FromUserName: [ 'oAsoR1iP-_D3LZIwNCnK8BFotmJc' ],
                 CreateTime: [ '1530001675' ],
                 MsgType: [ 'text' ],
                 Content: [ '774' ],
                 MsgId: [ '6571307157375473517' ] } }
             */
            //格式化数据
            const message = formatMessage(jsData);
            console.log(message);
            /*
              { ToUserName: 'gh_4fe7faab4d6c',
                FromUserName: 'oAsoR1iP-_D3LZIwNCnK8BFotmJc',
                CreateTime: '1530002262',
                MsgType: 'text',
                Content: '888',
                MsgId: '6571309678521276386' }
             */

            //返回用户消息
            /*
              1. 假如服务器无法保证在五秒内处理并回复
              2. 回复xml数据中有多余的空格 *****
              3. 回复文本内容，中options.content='' ***
              如果有以上现象，就会导致微信客户端中的报错：
                '该公众号提供服务出现故障，请稍后再试'
             */
            //设置回复用户消息的具体内容
            const replyMessage = await reply(message);
            console.log(replyMessage);  //Promise { <pending> }
            //返回响应给微信服务器
            res.send(replyMessage);

            /*//先返回一个空的响应给微信服务器
            res.send('');*/
        }
    }
}
