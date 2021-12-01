const express = require("express");
const router = express.Router();
const { requestPost,requestGet } = require('../core/request')
const { HttpException, PrameterException } = require('../core/http-exceptions')
const wxAccessToken = require('../utils/wx-access-token');

/**
 * 获取小程序全局唯一后台接口调用凭据（access_token）。调用绝大多数后台接口时都需使用 access_token，开发者需要进行妥善保存。
 */
router.get("/getToken",async (req,res, next)=> {
    wxAccessToken().then(result=>{
        if (result.errcode) {
            res.send({
                code: result.errcode,
                msg: result.errmsg
            })
        } else {
            res.send({
                code: 200,
                msg: '处理成功',
                data: result
            })
        }
    }).catch(error=>{
        return next(new HttpException(500, error.message))
    })
});

router.post("/send",async (req,res, next)=> {
    console.log(req.body.template_id);
    if(!req.body.template_id) {
        return next(new PrameterException(400, '订阅模板id不能为空'));
    }
    wxAccessToken().then(result=>{
        if(result.access_token) {
            requestPost({
                url: `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${result.access_token}`,
                isWx: true,
                data:{
                    "touser": "obhg25Z-Mc_DBZAm9pe39aEgk0GQ",
                    "template_id": "RRuuMDMgEFhpyK97PFaLdbrf0fmGxc2VHhkmNjHoHl8",
                    "page": "pages/index/index",
                    "miniprogram_state":"developer",
                    "lang":"zh_CN",
                    "data": {
                        "time3": {
                            "value": "2021-19-16 15:48:56"
                        },
                        "thing2": {
                            "value": "这是订阅消息通知"
                        }
                    }
                }
            }).then(async res => {
                console.log(789,res);
            }).catch(err=>{
                console.log(456,err);
            })
        }
    }).catch(error=>{
        console.log(123,error);
    })
});







module.exports = router;