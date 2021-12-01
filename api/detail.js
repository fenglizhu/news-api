const express = require("express");
const router = express.Router();
const Recomend = require('../model/Recomend');
const { requestGet } = require('../core/request')
const { HttpException, PrameterException, SqlException, NotFoundException } = require('../core/http-exceptions')

/**
 * 文章详情
 * 先查找数据库中有没有这条数据
 *      如果有：再查凯迪网
 *      如果没有：直接抛出文章不存在
 */
router.get("/info", async (req,res, next)=> {
    if(!req.query.id) {
        return next(new PrameterException(400, '文章id不能为空'));
    }
    try {
        let exit = await Recomend.findOne({
            'where': {
                'id': req.query.id
            }
        })
        if(exit) {
            let data = exit.toJSON()
            if(data.id){
                requestGet({
                    url: `/kd-content/contents/queryone/${req.query.id}`,
                }).then(result=>{
                    if(result.code == 200) {
                        result.data['editTime'] = data.exit_time
                        result.data['b_description'] = data.description
                    }
                    res.send({
                        code: result.code,
                        msg: result.msg,
                        data: result.data
                    })
                }).catch(error=>{
                    return next(new HttpException(500, error.message));
                })
            }
        } else {
            return next(new NotFoundException(412, '文章不存在'));
        }
    } catch (err) {
        return next(new SqlException(600,err.message));
    }
});


module.exports = router;