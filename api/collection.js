const express = require("express");
var sd = require('silly-datetime');
const router = express.Router();
const Collection = require('../model/Collection');
const Recomend = require('../model/Recomend');
const { HttpException, SqlException  } = require('../core/http-exceptions');

/**
 * 个人收藏列表
 */
router.get('/clist',async (req,res, next)=> {
    try {
        let userId = req.tokens;
        let data = await Collection.findAndCountAll({
            'where': {
                'user_id': userId,
                collect_status: 1
            },
            raw: true,   // 可以返回数组
            order: [
                // 按照修改时间降序排序
                ['updated_at', 'DESC']
            ],
            attributes: ['id'],
            limit: 20,
            page: 1,
            /**
             * include关键字表示关联查询
             * 指定关联的model
             * 这里的attributes属性表示查询Recomend表的字段
             * 目前这里不需要关联
             * ['id', 'articleId']  可以重命名
             */
            include: [{
                model: Recomend,
                attributes: ['id', 'title', 'description', 'cover']
            }],
        })
        let result = [];
        data.rows.forEach(item => {
            if(item['article.id']) {
                result.push({
                    id: item['article.id'],
                    title: item['article.title'],
                    description: item['article.description'],
                    cover: item['article.cover']
                })
            }
        });
        res.send({
            code: 200,
            msg: '处理成功',
            data: result
        })
    } catch (error) {
        return next(new SqlException(600,error.message))
    }
})

/**
 * 用户是否对这篇文章收藏或者点赞过
 */
router.get('/status',async (req,res, next)=> {
    if(!req.query.id) {
        return next(new HttpException(400,'文章id不能为空'))
    }
    try {
        let id = req.query.id;
        let userId = req.tokens;
        let exit = await Collection.findOne({
            'where': {
                'user_id': userId,
                'id': id
            }
        })
        let collect_status = 0;
        let star_status = 0;
        if (exit) {
            collect_status = exit.toJSON().collect_status
            star_status = exit.toJSON().star_status
        }
        res.send({
            code: 200,
            msg: '处理成功',
            data: {
                collect_status,
                star_status
            }
        })
    } catch (error) {
        return next(new SqlException(600,error.message))
    }
})

/**
 * 收藏或者取消收藏操作
 */
router.post('/addRemove',async (req,res, next)=> {
    /**
     * 通过id和user_id查找收藏点赞表
     * 如果有数据
     *      则跟数据里面状态做相反的操作
     * 如果没有数据，则往收藏点赞表添加该数据，状态为1
     */
     if(!req.body.id) {
        return next(new HttpException(400,'文章id不能为空'))
    }
    let id = req.body.id;
    let userId = req.tokens;
    try {
        let collectWhere = {
            'where': {
                'user_id': userId,
                'id': id
            }
        }
        let collect_status = 1;
        // 先查找数据库中有没有这条数据，如果有先删除再插入
        let exit = await Collection.findOne(collectWhere)
        
        // 存在就更新，跟新的状态跟数据库里面的状态相反
        if (exit) {
            let data = exit.toJSON();
            collect_status = data.collect_status == 0 ? 1 : 0;
            await Collection.update({
                collect_status
            }, collectWhere);
        // 不存在就创建记录，同时更新
        } else {
            await Collection.create({
                user_id: userId,
                id: id,
                collect_status,
                collect_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
            })
        }
        // 更新收藏数
        let articleWhere = {
            'where': {
                'id': id
            }
        }
        var article = await Recomend.findOne(articleWhere)
        var articleInfo = article.toJSON();
        await Recomend.update({
            collect_count: articleInfo.collect_count + (collect_status == 1 ? collect_status : (-1))
        }, articleWhere)

        res.send({
            code: 200,
            msg: '处理成功',
            data: {
                collect_status
            }
        })
    } catch (error) {
        return next(new SqlException(600,error.message))
    }
})

module.exports = router