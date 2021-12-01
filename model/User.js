/**
 * 后台管理用户数据表模型
 */

const { Model, DataTypes } = require("sequelize");
const sequelize = require('../db/sequelize.js')
class User extends Model {}
User.init({
    id:{
        field: 'id',     // 收藏用户的 openid
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    account: {
        field:'account',     // 字段名
        type: DataTypes.STRING,
        allowNull: false,   // 是否允许为空
    },
    username: {
        field:'username',     // 字段名
        type: DataTypes.STRING,
    },
    password: {
        field:'password',     // 字段名
        type: DataTypes.STRING
    },
    avatar: {
        field:'avatar',     // 字段名
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: 'user',   // 表名
    charset: 'utf8',
    collate: 'utf8_general_ci'
})

module.exports = User;