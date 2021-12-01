const express = require("express");
var sd = require('silly-datetime');
const router = express.Router();
const Collection = require('../model/Collection');
const Recomend = require('../model/Recomend');
const { SqlException  } = require('../core/http-exceptions');

/**
 * 点赞或者取消点赞操作
 */
router.post('/addRemove',async (req,res, next)=> {
    /**
     * 通过id和user_id查找收藏点赞表
     * 如果有数据
     *      则跟数据里面状态做相反的操作
     * 如果没有数据，则往收藏点赞表添加该数据，状态为1
     */
    let id = req.body.id;
    let userId = req.tokens;
    try {
        let collectWhere = {
            'where': {
                'user_id': userId,
                'id': id
            }
        }
        let star_status = 1;
        // 先查找数据库中有没有这条数据，如果有先删除再插入
        let exit = await Collection.findOne(collectWhere)
        
        // 存在就更新，跟新的状态跟数据库里面的状态相反
        if (exit) {
            let data = exit.toJSON();
            star_status = data.star_status == 0 ? 1 : 0;
            await Collection.update({
                star_status
            }, collectWhere);
        // 不存在就创建记录，同时更新
        } else {
            await Collection.create({
                user_id: userId,
                id: id,
                star_status,
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
            star_count: articleInfo.star_count + (star_status == 1 ? star_status : (-1))
        }, articleWhere)

        res.send({
            code: 200,
            msg: '处理成功',
            data: {
                star_status
            }
        })
    } catch (error) {
        return next(new SqlException(600,error.message))
    }
})

module.exports = router