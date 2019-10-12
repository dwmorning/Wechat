/*
  处理并分析用户发送的消息
  决定返回什么消息给用户
 */

const Wechat = require('./wechat');

const wechatApi = new Wechat();

module.exports = async message => {

    //设置回复用户消息的具体内容
    let content = '';
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            //用户订阅事件
            content = '欢迎关注成都信息工程大学招生官方微信';
        }
    }
    //将最终回复消息内容添加到options中
    options.content = content;
    //将最终的xml数据返回出去
    return options;
}
