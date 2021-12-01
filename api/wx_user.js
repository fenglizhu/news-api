const express = require("express");
const router = express.Router();
const WxUser = require('../model/WxUser');
const { requestGet } = require('../core/request')
const { wxConfig } = require('../config/index')
const { HttpException, SqlException  } = require('../core/http-exceptions');
const { setToken } = require('../utils/token');
const { encrypt } =  require('../utils/crypto')

// 微信登录接口 https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code

router.post('/wx/login',async (req,res, next)=> {
    if(!req.body.code){
        return next(new PrameterException(400,'登录凭证不能为空'))
    }
    requestGet({
        url: `https://api.weixin.qq.com/sns/jscode2session?appid=${wxConfig.appid}&secret=${wxConfig.secret}&js_code=${req.body.code}&grant_type=authorization_code`,
        isWx: true,
    }).then(async result => {
        if(result.errcode) {
            return next(new HttpException(result.errcode, result.errmsg))
        } else {
            let token = await setToken(result.openid)
            let openidEncrypt = encrypt(token);
            try {
                // 先从数据库查找有没有该用户
                let exit = await WxUser.findOne({
                    'where': {
                        'openid': openidEncrypt
                    }
                })
                // 存在就更新数据
                if(exit) {
                    let data = exit.toJSON()
                    await WxUser.update({
                        'nickName': req.body.userInfo.nickName || data.nickName,
                        'avatarUrl': req.body.userInfo.avatarUrl || data.avatarUrl,
                        'session_key': result.session_key || data.session_key
                    }, {
                        'where': { 'openid': openidEncrypt } 
                    })
                // 不存在就插入数据
                } else {
                    await WxUser.create({
                        openid: openidEncrypt,
                        nickName: req.body.userInfo.nickName || '',
                        avatarUrl: req.body.userInfo.avatarUrl || '',
                        session_key: result.session_key
                    })
                }
                res.send({
                    code: 200,
                    msg: '登录成功',
                    data: {
                        token
                    }
                })
            } catch (error) {
                return next(new SqlException(600, error.message))
            }
        }
    }).catch(error=>{
        return next(new HttpException(500, error.message))
    })
})

module.exports = router