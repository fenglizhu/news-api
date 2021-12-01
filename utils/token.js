var JWToken = require('jsonwebtoken');
var { JWT_SCRECT, unlessUrl,EXPIRESIN } = require('../config/index');
const { decrypt } =  require('../utils/crypto');
/**
 * 生成token
 * @param {*} data 
 * @returns 
 * expiresln 设置token过期的时间
 */
const setToken = function (data) {
    return new Promise((resolve, reject) => {
        // , {
        //     expiresIn: EXPIRESIN
        // }
        const token = JWToken.sign(data, JWT_SCRECT);
        resolve(token)
    })
}

//验证token
const getToken = function (token, url) {
    return new Promise((resolve, reject) => {
        // 可以忽略的路由里面有没有当前路由，有直接成功处理
        if(unlessUrl.includes(url)){
            if(token) {
                JWToken.verify(token, JWT_SCRECT, (error, decoded)=>{
                    resolve(decoded)
                })
            } else {
                resolve('验证通过')
            }
            
        }
        if (!token) {
            reject({
                code: 401,
                msg: 'token不能为空'
            })
        }
        else {
            JWToken.verify(token, JWT_SCRECT, (error, decoded)=>{
                if(error) {
                    if(error.name && error.name == 'TokenExpiredError') {
                        reject({
                            code: 402,
                            msg: 'token已失效'
                        })
                    }else {
                        reject({
                            code: 606,
                            msg: 'token验证失败'
                        })
                    }
                }
                console.log('验证通过了？',decoded);
                resolve(decoded)
            });
        }
    })
}

module.exports = {
    setToken,
    getToken
}