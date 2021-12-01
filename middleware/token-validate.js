/**
 * token验证中间件
 */

const expressJWT = require('express-jwt');
const { getToken } = require('../utils/token');
const { JWT_SCRECT } = require('../config/index')
const { encrypt } =  require('../utils/crypto');
const expressJwt = ()=> {
    return expressJWT({
        secret: JWT_SCRECT,
        algorithms: ['HS256'],
    }).unless({
    　　path: ['/api/user/login','/api/upload/oss'] //⽩白名单,除了了这⾥里里写的地址，其他的URL都需要验证，其实没有效果  至于原因暂时找不到
    })
}

const tokenValidate = (err,req, res, next)=>{
    let url = req.url;
    let index = url.indexOf('?');
    if(index >= 0) {
        url = url.slice(0,index)
    }
    if( req.method != 'OPTIONS'){
        let token = req.headers['authorization']
        getToken(token, url).then(data=>{
            req.tokens = encrypt(data);
            next();
        }).catch(error=>{
            return next(error)
        })
    } else {
        next()
    }
}

module.exports = {
    expressJwt,
    tokenValidate
}