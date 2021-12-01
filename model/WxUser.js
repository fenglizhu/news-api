/**
 * 小程序用户数据表模型
 */
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../db/sequelize.js')
class WxUser extends Model {}
WxUser.init({
    id:{
        field: 'id',     // 收藏用户的 openid
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    openid: {
        field:'openid',     // 字段名
        type: DataTypes.STRING,
        allowNull: false,   // 是否允许为空
    },
    nickName: {
        field:'nickName',     // 字段名
        type: DataTypes.STRING
    },
    avatarUrl: {
        field:'avatarUrl',     // 字段名
        type: DataTypes.STRING
    },
    session_key:{
        field:'session_key',     // 字段名
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'wx_user',   // 表名
    charset: 'utf8',
    collate: 'utf8_general_ci'
})

module.exports = WxUser;