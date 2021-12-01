const express = require("express");
var sd = require('silly-datetime');
const { Op } = require("sequelize");
const router = express.Router();
const Recent = require('../model/Recent');
const Recomend = require('../model/Recomend');
const { PrameterException, SqlException, NotFoundException } = require('../core/http-exceptions')

/**
 * 精品必看列表
 * 直接在总表里面查询
 */
router.post("/lists",async (req,res, next)=> {
    // // 分页
    try {
        let limit = req.body.limit || 5;
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
        const { count, rows } = await Recent.findAndCountAll({
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
            order: [
                // 按照修改时间排序
                ['updated_at', 'DESC']
            ],
            attributes: {
                exclude: ['updated_at', 'deleted_at', 'created_at'],    // 除去不需要返回的字段
                include: ['title'], // 控制查询字段
            },
            limit: limit,
            offset: page == 1 ? 0 : ((page - 1) * limit)
        });
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
    try {
        // 先查找数据库中有没有这条数据，如果有先删除再插入
        let exit = await Recomend.findOne({
            'where': {
                'id': req.body.id
            }
        })
        if (exit) {
            // 先查找数据库中有没有这条数据，如果有
            let detail = exit.toJSON()
            let recentInfo = await Recent.findOne({
                'where': {
                    'id': req.body.id
                }
            })
            if(recentInfo) {
                await Recomend.destroy({
                    where: {
                        id: recentInfo.id
                    },
                    exclude:['created_at', 'updated_at']
                });
            }
            detail.exit_time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
            await Recent.create(detail);
            res.send({
                code: 200,
                msg: '处理成功'
            })
        } else {
            return next(new NotFoundException(412, '文章不存在'));
        }
        
    } catch (err) {
        return next(new SqlException(600,err.message));
    }
    
});

module.exports = router;