/**
 * 收藏点赞数据表模型
 */

const { Model, DataTypes } = require("sequelize");
const sequelize = require('../db/sequelize.js')
const Recomend = require('../model/Recomend');

class Collection extends Model {}
Collection.init({
    no:{
        field: 'no',     // 收藏用户的 openid
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true     // 自增
    },
    user_id: {
        field: 'user_id',     // 收藏用户的 openid
        type: DataTypes.STRING
    },
    id: {
        field: 'id',
        type: DataTypes.INTEGER,
    },
    collect_status: {
        field: 'collect_status',
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    star_status: {
        field: 'star_status',
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    collect_time: {
        field: 'collect_time',
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'collection',   // 表名
    charset: 'utf8',
    collate: 'utf8_general_ci'
})

// 收藏表是1对多（一个用户对应多个文章id）的关系
Collection.belongsTo(Recomend, { foreignKey: 'id' });

module.exports = Collection;