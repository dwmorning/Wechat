/*
    获取access_token
        是什么？微信调用接口的全局唯一凭据

        特点
            1.唯一性
            2.有效性2小时，提前5分钟请求
            3.接口权限 每天2000次

        请求地址：https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
        请求方式：GET

        设计思路：
            1.首次本地没有，发送请求获取access_token,保存下来（本地文件）
            2.第二次或以后：
                -先去本地读取文件，判断是否过期
                    -过期           重新请求获取access_token，保存下来，覆盖之前的文件（保证文件是唯一的）
                    -没有过期       直接使用

         整体思路：
            读取本地文件（readAccessToken）
                -本地有文件
                    -判断是否过期(isValidAccessToken)
                    重新请求获取access_token，(getAccessToken)保存下来，覆盖之前的文件（保证文件是唯一的）(saveAccessToken)
                -本地没有文件
                    -发送请求获取access_token,(getAccessToken)保存下来（本地文件）(saveAccessToken)
 */
//引入fs模块
const {writeFile, readFile} = require('fs');
//引入config模块
const {appID,appsecret} = require('../config');
//只需要引入request-promise-native
const rp = require('request-promise-native');

const menu = require('./menu');
//定义类，获取access_token
class Wechat{
    constructor(){

    }
    /*
        用来获取access_token
     */
    getAccessToken(){
        //定义请求地址
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
        //发送请求
        /*
            两个库函数
            request
            request-promise-native  返回值是一个promise对象
         */
        return new Promise((resolve, reject) =>{
            rp({method: 'GET', url:url,json: true})
                .then(res => {
                    console.log(res);
                    /*
                    成功返回access_token
                        { access_token:
                           '23_wAjz4amsG7RV4tK4U16p9GRO6unxvhfdpwRPjwcf1XlxPesu20p0orstg2pN1dV1g7X6LBD6qr-_vb6zE7WOmrcBdAupWDxMw25qNoGeq45Dzv21IJRxAbggSYCNUKr_x4qaZBzQ7Xv8DHhsDCUaABAHGY',
                          expires_in: 7200 }
                     */
                    //设置access_token的过期时间
                    res.expires_in = Date.now() +(res.expires_in -300)*1000;
                    //将promise对象状态改成成功的状态
                    resolve(res);
                })
                .catch(err =>{
                    console.log(err);
                    reject('getAccessToken方法失败'+err);
                })

        })

    }

    /*
        用来保存access_token
        @param accessToken要保存的凭据
     */
    saveAccessToken(accessToken){
        //将对象转化成json字符串
        accessToken = JSON.stringify(accessToken);
        //将access_token保存一个文件
        return new Promise(((resolve, reject) => {
            writeFile('./accessToken.txt',accessToken,err =>{
                if(!err){
                    console.log('文件保存成功～');
                    resolve();
                }else{
                    reject('saveAccesToken方法出了问题'+err);
                }

            })
        }))


    }

    /*
        用来读取access_token
     */
    readAccessToken(){
        //读取本地文件access_token
        return new Promise(((resolve, reject) => {
            readFile('./accessToken.txt',(err,data) =>{
                if(!err){
                    console.log('文件读取成功～');
                    //将json字符串转化js对象
                    data = JSON.parse(data);
                    resolve(data);
                }else{
                    reject('readAccesToken方法出了问题'+err);
                }

            })
        }))


    }

    /*
        用来检查access_token是否有效
         @param accessToken要保存的凭据
     */
    isValidAccessToken(data){
        //检测传入的参数是否有效
        if(!data &&!data.access_token &&!data.expires_in){
            //代表access_token无效
            return false;
        }

        //检测access_token是否在有效期内
        /*

         */
        return data.expires_in > Date.now();
    }

    /*
        获取没有过期的access_token
        @return{Promise<any>} access_token
     */
    fetchAccessToken () {
        //优化操作,优化不去执行读取文件操作
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            //说明this有凭据和过期时间，并且凭据未过期
            return Promise.resolve({access_token: this.access_token, expires_in: this.expires_in});
        }
        return this.readAccessToken()
            .then(async res => {
                //判断凭据是否过期(isValidAccessToken)
                if (this.isValidAccessToken(res)) {
                    //没有过期，直接使用
                    return Promise.resolve(res);
                } else {
                    //重新发送请求获取凭据
                    const data = await this.getAccessToken();
                    //保存下来
                    await this.saveAccessToken(data);
                    //将请求回来的凭据返回出去
                    return Promise.resolve(data);
                }
            })
            .catch(async err => {
                console.log(err);
                //重新发送请求获取凭据
                const data = await this.getAccessToken();
                //保存下来
                await this.saveAccessToken(data);
                //将请求回来的凭据返回出去
                return Promise.resolve(data);
            })
            .then(res => {
                //将其请求回来的凭据和过期时间挂载到this上
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;
                //指定fetchAccessToken方法返回值
                return Promise.resolve(res);
            })
    }

    /*
        用来创建自定义菜单

     */
    creatMeun(menu){
        return new Promise(async (resolve, reject) => {
            try {
                //获取access_token
                const data =await this.fetchAccessToken();
                //定义请求地址
                const url = ` https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;
                //发送请求
                const result = await rp({method: 'POST',url, json:true,body:menu});
                resolve(result);
            }catch (e) {
                reject('creatMeun方法出错'+e);
            }
        })
    }

    /*
        删除菜单
     */
    deleteMenu(){
        return new Promise(async (resolve,reject) => {
            try{
                const data = await this.fetchAccessToken();
                //定义请求地址
                const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`;
                //发送请求
                const result = await rp({method: 'GET',url, json:true});
                resolve(result);
            }catch(e){
                reject('deleteMenu方法出现问题'+e);
            }

        })
    }
}


//模拟测试
//const w = new Wechat();

//w.getAccessToken();
(async () => {
    const w = new Wechat();
    //删除
    let result =await w.deleteMenu();
    console.log(result);
    //创建
    result = await w.creatMeun();
    console.log(result);
})()
