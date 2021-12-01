const MongoClient = require('mongodb').MongoClient;  // 创建Mongo的客户端对象
const { mongodb } = require('../config/index')
// 数据库的连接方法封装
const connect = (callback) =>{
    // 使用connect方法连接到服务器
    // err:错误对象。client：客户端连接成功的对象
    MongoClient.connect(mongodb.url, async (err, client) => {
        if(err){
            console.log('数据库连接错误！',err);
        }else{  // 否则
            const db = client.db(mongodb.database);  // 数据库连接成功的对象
            await callback && callback(db,client);  // 利用回调函数处理
        }
    });
}

// 后来想用mongodb，还是没有用

module.exports = { connect }
