/*
  工具函数
 */
//引入解析xml数据的库
const {parseString} = require('xml2js');
//引入fs模块
const {readFile, writeFile, createReadStream, createWriteStream} = require('fs');
//引入path模块
const {resolve} = require('path');

module.exports = {
    getUserDataAsync (req) {
        /*
          用户数据是通过流的方式发送，通过绑定data事件接受数据
         */
        return new Promise((resolve, reject) => {
            let data = '';
            req
                .on('data', userData => {
                    //将流式数据全部拼接起来
                    data += userData;
                })
                .on('end', () => {
                    //确保数据全部获取了
                    resolve(data);
                })
        })
    },
    parseXMLAsync (xmlData) {
        return new Promise((resolve, reject) => {
            parseString(xmlData, {trim: true}, (err, data) => {
                if (!err) {
                    //解析成功了
                    resolve(data);
                } else {
                    //解析失败了
                    reject('parseXMLAsync方法出了问题：' + err);
                }
            })
        })
    },
    formatMessage (jsData) {
        const data = jsData.xml;
        //初始化一个空的对象
        let message = {};
        //判断数据是一个合法的数据
        if (typeof data === 'object') {
            //循环遍历对象中的所有数据
            for (let key in data) {
                //获取属性值
                let value = data[key];
                //过滤掉空的数据和空的数组
                if (Array.isArray(value) && value.length > 0) {
                    //在新对象中添加属性和值
                    message[key] = value[0];
                }
            }
        }
        //将格式化后的数据返回出去
        return message;
    },
    writeFileAsync(data, fileName){
        data = JSON.stringify(data);
        const filePath = resolve(__dirname,fileName);
        return new Promise((resolve, reject) => {
            //将ticket保存为一个文件
            writeFile(filePath, data, err => {
                if (!err) {
                    //写入成功
                    console.log('文件保存成功');
                    resolve();
                } else {
                    //写入失败
                    reject('writeFileAsync方法出了问题：' + err);
                }
            })
        })

    },
    readFileAsync(fileName) {
        const filePath = resolve(__dirname,fileName);
        return new Promise((resolve, reject) => {
            //将ticket读取出来
            readFile(filePath, (err, data) => {
                if (!err) {
                    //将读取的Buffer数据转化为json字符串
                    console.log('文件读取成功');
                    //data = data.toString();
                    //将json字符串转化为对象
                    data = JSON.parse(data);
                    //读取成功
                    resolve(data);
                } else {
                    //读取失败
                    reject('readFileAsync方法出了问题：' + err);
                }
            })
        })
    }
}
