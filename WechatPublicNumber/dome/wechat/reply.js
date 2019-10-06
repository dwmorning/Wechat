/*
  处理并分析用户发送的消息
  决定返回什么消息给用户
 */
const template = require('./template');
const Wechat = require('./wechat');

const wechatApi = new Wechat();

module.exports = async message => {

    //定义options
    let options = {
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now(),
        msgType: 'text'
    }

    //设置回复用户消息的具体内容
    let content = '';
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            //用户订阅事件
            content = '欢迎关注成都信息工程大学招生官方微信';
        }
    }
    // //判断用户发送消息的类型和内容，决定返回什么消息给用户
    // if (message.MsgType === 'text') {
    //     if (message.Content === '1') {
    //         content = '大吉大利，今晚吃鸡';
    //     } else if (message.Content === '2') {
    //         content = '落地成盒';
    //     } else if (message.Content === '3') {
    //         //回复图文消息
    //         content = [{
    //             title: 'Nodejs开发',
    //             description: '微信公众号开发',
    //             picUrl: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1841004364,244945169&fm=58&bpow=121&bpoh=75',
    //             url: 'http://nodejs.cn/'
    //         }, {
    //             title: 'web前端',
    //             description: '这里有最新、最强的技术',
    //             picUrl: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1981851186,10620031&fm=58&s=6183FE1ECDA569015C69A554030010F3&bpow=121&bpoh=75',
    //             url: 'http://www.atguigu.com/'
    //         }];
    //         options.msgType = 'news';
    //
    //     } else if (message.Content === '4') {
    //         //上传一个多媒体素材
    //         const data = await wechatApi.uploadTemporaryMaterial('image', 'C:\\Users\\web\\Desktop\\图片\\1.jpg');
    //         console.log(data);
    //         /*
    //           { type: 'image',
    //             media_id: 'nT2v9ObOdrUjMU-kIAQrNTy1I3pZI0_ZO8yV6zB3N0KHVg92nlToTEpNXbkTcskV',
    //             created_at: 1530070685 }
    //          */
    //         //返回一个图片消息给用户
    //         options.msgType = 'image';
    //         options.mediaId = data.media_id;
    //
    //     } else if (message.Content === '5') {
    //         //获取一个多媒体素材
    //         await wechatApi.getTemporaryMaterial('nT2v9ObOdrUjMU-kIAQrNTy1I3pZI0_ZO8yV6zB3N0KHVg92nlToTEpNXbkTcskV', __dirname + '/1.jpg');
    //         content = '获取多媒体素材成功了~~';
    //
    //     } else if (message.Content === '6') {
    //         //上传图文素材中的图片
    //         const {url} = await wechatApi.uploadPermanentMaterial('pic', 'C:\\Users\\web\\Desktop\\图片\\9.jpg');
    //         console.log(url); //http://mmbiz.qpic.cn/mmbiz_jpg/l6hEPf9t1fFUdjGSkqfWVexQ9USA1g0Gec4G2tyQicPUrDNaEL0pxkiaJf1mQfh8PGEia77DW0HhvJJm7U1YMw2lw/0
    //         //上传缩略图
    //         const {media_id} = await wechatApi.uploadPermanentMaterial('image', 'C:\\Users\\web\\Desktop\\图片\\9.jpg');
    //         console.log(media_id); //1_821D3VHxMTbMuZ5-DSoFvgSbQCngMIAwITtEBCZJE
    //         //上传图文素材
    //         const newsList = {
    //             "articles": [{
    //                 "title": '大美女',
    //                 "thumb_media_id": media_id,
    //                 "author": '佚名',
    //                 "digest": '这里有个大美女',
    //                 "show_cover_pic": 1,
    //                 "content": '<!DOCTYPE html>\n' +
    //                     '<html lang="en">\n' +
    //                     '<head>\n' +
    //                     '  <meta charset="UTF-8">\n' +
    //                     '  <title>test</title>\n' +
    //                     '</head>\n' +
    //                     '<body>\n' +
    //                     '  <h1>这是一个测试</h1>\n' +
    //                     '  <img src="' + url + '">\n' +
    //                     '</body>\n' +
    //                     '</html>',
    //                 "content_source_url": 'http://www.atguigu.com'
    //             },{
    //                 "title": '大美女',
    //                 "thumb_media_id": media_id,
    //                 "author": '佚名',
    //                 "digest": '这里有个大美女',
    //                 "show_cover_pic": 1,
    //                 "content": '<!DOCTYPE html>\n' +
    //                     '<html lang="en">\n' +
    //                     '<head>\n' +
    //                     '  <meta charset="UTF-8">\n' +
    //                     '  <title>test</title>\n' +
    //                     '</head>\n' +
    //                     '<body>\n' +
    //                     '  <h1>这是一个测试</h1>\n' +
    //                     '  <img src="' + url + '">\n' +
    //                     '</body>\n' +
    //                     '</html>',
    //                 "content_source_url": 'http://www.atguigu.com'
    //             }]
    //         }
    //         const data = await wechatApi.uploadPermanentMaterial('news', newsList);
    //         console.log(data); //{ media_id: '1_821D3VHxMTbMuZ5-DSoIBjlGzb2e9R3jGwhrTOGas' }
    //
    //         content = '上传永久素材成功了~~';
    //
    //     } else if (message.Content === '7') {
    //         //获取永久素材
    //         const newsData = await wechatApi.getPermanentMaterial('news', '1_821D3VHxMTbMuZ5-DSoIBjlGzb2e9R3jGwhrTOGas');
    //         console.log(newsData);
    //         //返回给用户
    //         content = [];
    //         newsData.news_item.forEach(item => {
    //             content.push({
    //                 title: item.title,
    //                 description: item.digest,
    //                 picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/l6hEPf9t1fFUdjGSkqfWVexQ9USA1g0Gec4G2tyQicPUrDNaEL0pxkiaJf1mQfh8PGEia77DW0HhvJJm7U1YMw2lw/0',
    //                 url: item.url
    //             })
    //         })
    //         options.msgType = 'news';
    //     } else if (message.Content === '8') {
    //         //更新永久图文素材
    //         const body = {
    //             "media_id": '1_821D3VHxMTbMuZ5-DSoIBjlGzb2e9R3jGwhrTOGas',
    //             "index": 0,
    //             "articles": {
    //                 "title": '大帅哥',
    //                 "thumb_media_id": '1_821D3VHxMTbMuZ5-DSoFvgSbQCngMIAwITtEBCZJE',
    //                 "author": '0315',
    //                 "digest": '这是一个大帅哥',
    //                 "show_cover_pic": 0,
    //                 "content": 'hello 爱他硅谷',
    //                 "content_source_url": 'http://www.baidu.com'
    //             }
    //         }
    //         let data = await wechatApi.updatePermanentNews(body);
    //         console.log(data); //{ errcode: 0, errmsg: 'ok' }
    //         //获取永久素材的数量
    //         data = await wechatApi.getPermanentCount();
    //         console.log(data);
    //         /*
    //           { voice_count: 1,
    //             video_count: 9,
    //             image_count: 48,
    //             news_count: 20 }
    //          */
    //         //获取指定素材的列表
    //         data = await wechatApi.getPermanentList({
    //             type: 'news',
    //             offset: 0,
    //             count: 20
    //         });
    //         console.log(data);
    //         //删除永久素材
    //         data = await wechatApi.deletePermanentMaterial('1_821D3VHxMTbMuZ5-DSoIBjlGzb2e9R3jGwhrTOGas');
    //         console.log(data);
    //         //返回给用户
    //         content = '测试api';
    //     } else if (message.Content.match('爱')) {
    //         //模糊匹配，只要包含爱
    //         content = '我爱你~';
    //     } else {
    //         content = '您在说啥，我听不懂';
    //     }
    // } else if (message.MsgType === 'image') {
    //     content = '您的图片地址为：' + message.PicUrl;
    // } else if (message.MsgType === 'voice') {
    //     content = '语音识别结果：' + message.Recognition;
    // } else if (message.MsgType === 'video') {
    //     content = '接受了视频消息';
    // } else if (message.MsgType === 'shortvideo') {
    //     content = '接受了小视频消息';
    // } else if (message.MsgType === 'location') {
    //     content = '纬度：' + message.Location_X + ' 经度：' + message.Location_Y
    //         + ' 缩放大小：' + message.Scale + ' 详情：' + message.Label;
    // } else if (message.MsgType === 'link') {
    //     content = '标题：' + message.Title + ' 描述：' + message.Description + ' 网址：' + message.Url;
    // } else if (message.MsgType === 'event') {
    //     if (message.Event === 'subscribe') {
    //         //用户订阅事件
    //         content = '欢迎您的订阅~';
    //         if (message.EventKey) {
    //             //扫描带参数的二维码的订阅事件
    //             content = '欢迎您扫二维码的关注';
    //         }
    //     } else if (message.Event === 'SCAN') {
    //         //已经关注了公众号，在扫描带参数二维码进入公众号
    //         content = '已经关注了公众号，在扫描带参数二维码进入公众号';
    //     } else if (message.Event === 'unsubscribe') {
    //         //用户取消关注
    //         console.log('无情取关~');
    //     } else if (message.Event === 'LOCATION') {
    //         //用户进行会话时，上报一次地理位置消息
    //         content = '纬度：' + message.Latitude + ' 经度：' + message.Longitude + ' 精度：' + message.Precision;
    //     } else if (message.Event === 'CLICK') {
    //         content = '点击了菜单~~~';
    //     } else if (message.Event === 'VIEW') {
    //         //用户点击菜单，跳转到其他链接
    //         console.log('用户点击菜单，跳转到其他链接');
    //     }
    // }

    //将最终回复消息内容添加到options中
    options.content = content;
    //将最终的xml数据返回出去
    return template(options);
}
