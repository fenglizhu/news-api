/**
 * 链接数据库
 */
const { Sequelize } = require('sequelize');
const { dbConfig } = require('../config/index')
// TODO:配置正式环境和测试环境
const {
    database,
    user,
    password,
    host
} = dbConfig.dev;

const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql',
    timezone: '+08:00', // 保存为本地时区
    pool: {
        max: 5,         // 池中最大连接数
        idle: 30000,    // 连接在被释放之前可以空闲的最长时间
        acquire: 60000, // 该池在抛出错误之前尝试获取连接的最长时间
    },
    define: {
        timestamps: true,   // 启用时间戳
        underscored: true, // 注意需要加上这个， sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
        // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
        // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
        freezeTableName: true,
        createdAt: 'created_at',    // 别名
        updatedAt: 'updated_at',
        underscored: true,
        scopes: {
            bh: {
                attributes: {
                    exclude: ['updated_at', 'deleted_at', 'created_at']
                }
            }
        }
    }
});

/**
 * 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
 * force: true 将创建表,如果表已经存在,则将其首先删除，谨慎使用
 * alter: true  模型新增字段会自动在数据库中添加
 */
sequelize.sync({
    force: false
})

// 测试数据库是否连接成功
sequelize.authenticate()
    .then(res => {
        console.log('Connection Success!')
    })
    .catch(err => {
        console.log('Connection Error')
    })
module.exports = sequelize;