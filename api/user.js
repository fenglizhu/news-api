const express = require("express");
const router = express.Router();
const User = require('../model/User');
const { decrypt, initUsername } =  require('../utils/crypto')
const { setToken } = require('../utils/token')
const { HttpException, PrameterException,SqlException } = require('../core/http-exceptions')

/**
 * 后台管理登录接口
 */
router.post("/login", async (req,res, next)=> {
    if(!req.body.account) {
        return next(new PrameterException(400,'用户名不能为空'))
    }
    if(!req.body.password) {
        return next(new PrameterException(400,'密码不能为空'))
    }
    var password = decrypt(req.body.password);
    try {
        let exit = await User.findOne({
            'where': {
                'account': req.body.account
            }
        })
        if(exit) {
            let data = exit.toJSON()
            if(data.password == req.body.password) {
                setToken({account: data.account, password: data.password}).then(token=>{
                    res.send({
                        code: 200,
                        msg: '登录成功',
                        data:{
                            account: data.account,
                            username: data.username,
                            avatar: data.avatar,
                            token: token
                        }
                    })
                }).catch(err=>{
                    return next(new HttpException(500,err.message))
                })
            } else {
                return next(new PrameterException(107,'密码错误'))
            }
        } else {
            let username = '用户' + initUsername(req.body.account)
            let data = await User.create({
                account: req.body.account,
                username: username,
                password: req.body.password,
                avatar: ''
            });
            setToken({account: req.body.account, password: password}).then(token=>{
                res.send({
                    code: 200,
                    msg: '登录成功',
                    data:{
                        account: req.body.account,
                        username: username,
                        avatar: data.avatar,
                        token: token
                    }
                })
            }).catch(err=>{
                return next(new HttpException(500,err.message))
            })
        }
    } catch (error) {
        return next(new SqlException(600,error.message))
    }
});

/**
 * 后台管理注册用户接口
 */
router.post("/register", async (req,res, next)=> {
    if(!req.body.account) {
        return next(new PrameterException(400,'用户名不能为空'))
    }
    if(!req.body.password) {
        return next(new PrameterException(400,'密码不能为空'))
    }
    try {
        let exit = await User.findOne({
            'where': {
                'account': req.body.account
            }
        })
        if(!exit) {
            let username = '用户' + initUsername(req.body.account)
            await User.create({
                account: req.body.account,
                username: username,
                password: req.body.password,
                avatar: ''
            });
            res.send({
                code: 200,
                msg: '注册成功'
            })
        }else {
            return next(new HttpException(203,'用户已存在'))
        }
    }catch(error){
        return next(new SqlException(600,error.message))
    }
    
})

/**
 * 后台管理注销登录接口
 */
 router.post("/logout", async (req,res, next)=> {
    // if(!req.headers['authorization']) {
    //     return next(new PrameterException(400,'token不能为空'))
    // }
    res.send({
        code: 200,
        msg: '处理成功'
    })
});

module.exports = router;