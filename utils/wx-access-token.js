const { wxConfig } = require('../config/index');
const { requestGet } = require('../core/request')

/**
 * 获取小程序全局唯一后台接口调用凭据
 * @returns 
 */
const wxAccessToken = ()=>{
    return new Promise((resolve,reject)=>{
        requestGet({
            url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.appid}&secret=${wxConfig.secret}`,
            isWx: true,
        }).then(async result => {
            resolve(result)
        }).catch(error=>{
            reject(error.message)
        })
    })
}

module.exports = wxAccessToken