/**
 * 所有文章数据表模型
 */

const { Model, DataTypes } = require("sequelize");
const sequelize = require('../db/sequelize.js');

// 官方推荐，更加符合面向对象思想
class Recomend extends Model {}
Recomend.init({
    id: {
        field:'id',     // 字段名
        type: DataTypes.INTEGER,
        allowNull: false,   // 是否允许为空
        primaryKey: true
    },
    cover: {
        field:'cover',     // 字段名
        type: DataTypes.STRING,
        defaultValue: ''
    },
    title: {
        field:'title',     // 字段名
        type: DataTypes.STRING,
        defaultValue: ''
    },
    description: {
        field:'description',     // 字段名
        type: DataTypes.STRING,
        defaultValue: ''
    },
    exit_time: {
        field:'exit_time',     // 字段名
        type: DataTypes.STRING
    },
    star_count:{
        field:'star_count',     // 字段名
        type: DataTypes.INTEGER,
        defaultValue: 0         // 默认值
    },
    collect_count:{
        field:'collect_count',     // 字段名
        type: DataTypes.INTEGER,
        defaultValue: 0 
    },
    share_count:{
        field:'share_count',     // 字段名
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    comment_count:{
        field:'comment_count',     // 字段名
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    views:{
        field:'views',     // 字段名
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    cover_width:{
        field:'cover_width',     // 字段名
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    cover_height:{
        field:'cover_height',     // 字段名
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    author_name:{
        field:'author_name',     // 字段名
        type: DataTypes.STRING,
        defaultValue: ''
    },
    author_cover:{
        field:'author_cover',     // 字段名
        type: DataTypes.STRING,
        defaultValue: ''
    },
    type:{
        field:'type',     // 字段名
        type: DataTypes.STRING,
        defaultValue: 1
    }
},{
    sequelize,
    modelName: 'article',  // 表名
    charset: 'utf8',
    collate: 'utf8_general_ci'
})
module.exports = Recomend;