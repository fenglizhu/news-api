/**
 * 阿里云上传图片到oss
 */
var OSS = require('ali-oss');
const { aliConfig } = require('../config/index')
var client = new OSS({
    ...aliConfig,
    secure: true    // 支持https，默认false HTTP 
});
let ossPut = (file = {key: '', path: ''}) =>{
    return new Promise((resolve,reject)=>{
        client.useBucket(aliConfig.bucket);
        /**
         * key：需要上传到oss上面的绝对路径
         * path：本地文件路径
         */
        client.put(file.key, file.path).then(result=>{
            resolve(result)
        }).catch(error=>{
            reject(error)
        });
    })
}

module.exports = {
    ossPut
}