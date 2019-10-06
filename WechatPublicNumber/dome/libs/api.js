/*
  所有接口的文件
 */
//提取出来的接口前缀
const prefix = 'https://api.weixin.qq.com/cgi-bin/';

module.exports = {
    accessToken: `${prefix}token?grant_type=client_credential`,
    ticket: `${prefix}ticket/getticket?type=jsapi`,
    menu:{
      creat:`${prefix}media/creat?`,
      delete: `${prefix}media/delete?`
    },
    temporary: {
        upload: `${prefix}media/upload?`,
        get: `${prefix} }media/get?`
    },
    permanent: {
        uploadNews: prefix + 'material/add_news?',
        uploadImg: prefix + 'media/uploadimg?',
        uploadOthers: prefix + 'material/add_material?',
        get: prefix + 'material/get_material?',
        delete: prefix + 'material/del_material?',
        updateNews: prefix + 'material/update_news?',
        getCount: prefix + 'material/get_materialcount?',
        getMaterialList: prefix + 'material/batchget_material?'
    }
}
