
/**
 * 数据请求方法封装
 * 由于request已经废弃，所以使用got代替
 */
const got = require('got');
const { baseUrl } = require('../config/index')
const baseURL = baseUrl.dev;
let requestGet = ({url, data = {}, isWx = false}) =>{
    return new Promise(async (resolve,reject)=>{
        try {
            let response =  await got(isWx ? url : baseURL + url, data);
            resolve(JSON.parse(response.body))
        } catch (error) {
            reject(error)
        }
    })
}
let requestPost = ({url, data = {}, isWx = false}) =>{
    return new Promise(async (resolve,reject)=>{
        try {
            let response =  await got.post(
                isWx ? url : baseURL + url,
                {
                    json: data
                }
            );
            resolve(JSON.parse(response.body))
        } catch (error) {
            reject(error)
        }
    })
    
}

module.exports = {
    requestGet,
    requestPost
}