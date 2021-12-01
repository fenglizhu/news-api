const express = require("express");
var sd = require('silly-datetime');
const { Op } = require("sequelize");
const router = express.Router();
const Recomend = require('../model/Recomend');
const Collection = require('../model/Collection');
const { requestGet } = require('../core/request');
const { HttpException, PrameterException, SqlException, NotFoundException } = require('../core/http-exceptions')
const imageSize = require('../utils/imgSize')
/**
 * 推荐列表
 * 直接在总表里面查询
 */
router.post("/lists",async (req,res, next)=> {
    // 分页
    try {
        let limit = req.body.limit || 20;
        let page = req.body.page || 1;
        let title = req.body.title || '';
        let range = {};
        if(req.body.startTime) {
            range['updated_at'] = {
                [Op.lt]: new Date(req.body.endTime + ' 23:59:59'),
                [Op.gt]: new Date(req.body.startTime + ' 00:00:00'),
            }
        }
        // 可以传查询特定的属性，不然会返回,findAndCountAll查数据表总数
        const { count, rows } = await Recomend.findAndCountAll({
            where: {
                [Op.and]:[
                    {
                        title: {
                            [Op.like]: `%${title}%`
                        }
                    },
                    range
                ]
            },
            raw: true,   // 可以返回数组
            order: [
                // 按照修改时间排序
                ['created_at', 'DESC']
            ],
            attributes: {
                exclude: ['updated_at', 'deleted_at', 'created_at'],    // 除去不需要返回的字段
                include: ['title'], // 控制查询字段
            },
            limit: limit,
            offset: page == 1 ? 0 : ((page - 1) * limit)
        });
        // 是否需要关联收藏表查询，查当前状态
        if (req.body.star) {
            let ids = rows.map(item => { return item.id });
            let starData = await Collection.findAll({
                where:{
                    id: ids,
                    user_id: req.tokens
                },
                raw: true,   // 可以返回数组
            })
            rows.forEach(element => {
                element['collect_status'] = 0;
                element['star_status'] = 0;
                starData.forEach(sItem => {
                    if(element.id == sItem.id) {
                        element['collect_status'] = sItem.collect_status;
                        element['star_status'] = sItem.star_status;
                    }
                });
            });
        }
        res.send({
            code: 200,
            msg: '处理成功',
            data: {
                data: rows,
                total: count
            }
        })
    } catch (error) {
        return next(new SqlException(600, error.message));
    }
});

/**
 * 添加数据
 * 先查找数据库中有没有这条数据，如果有先删除再插入
 */
router.post("/add",async (req,res, next)=> {
    if(!req.body.id) {
        return next(new PrameterException(400, '文章id不能为空'));
    }
    requestGet({
        url: `/kd-content/contents/queryone/${req.body.id}`,
    }).then(async result=>{
        if(result.code != 200) {
            res.send({
                code: result.code,
                msg: result.msg
            })
        } else {
            try {
                // 先查找数据库中有没有这条数据，如果有先删除再插入
                let exit = await Recomend.findOne({
                    'where': {
                        'id': req.body.id
                    }
                })
                if(exit) {
                    return next(new HttpException(201,'文章已存在'));
                } else {
                    // 创建/编辑时间
                    req.body['exit_time'] = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                    let coverObj = await imageSize(req.body.cover)
                    req.body['cover_width'] = coverObj.coverWidth;
                    req.body['cover_height'] = coverObj.coverHeight;
                    if(result.data && result.data.author) {
                        req.body['author_name'] = result.data.author.nickname
                        req.body['author_cover'] = result.data.author.avatar
                    }
                    // 插入数据库
                    await Recomend.create(req.body);
                    res.send({
                        code: 200,
                        msg: '处理成功'
                    })
                }
                
            } catch (err) {
                return next(new SqlException(600,err.message));
            }
            
        }
    }).catch(error=>{
        return next(new HttpException(500,error.message));
    })
    
});
/**
 * 编辑数据
 * 部分编辑用patch
 * 全部编辑用put
 */
router.patch("/edit",async (req,res, next)=> {
    if(!req.body.id) {
        return next(new PrameterException(400, '文章id不能为空'));
    }
    try {
        // 先查找数据库中有没有这条数据，如果有先删除再插入
        let exit = await Recomend.findOne({
            'where': {
                'id': req.body.id
            },
            row:true
        })
        if(exit) {
            let data = exit.toJSON();
            let coverObj = {}
            if(req.body.cover) {
                coverObj = await imageSize(req.body.cover);
            }
            if(data.id){
                await Recomend.update({
                    'title': req.body.title || data.title,
                    'description': req.body.description || data.description,
                    'cover': req.body.cover || data.cover,
                    'exit_time': sd.format(new Date(), 'YYYY-MM-DD HH:mm'),
                    'cover_width': coverObj.coverWidth || data.cover_width,
                    'cover_height': coverObj.coverHeight || data.cover_height
                }, {
                    'where': { 'id': req.body.id } 
                })
                res.send({
                    code: 200,
                    msg: '处理成功'
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