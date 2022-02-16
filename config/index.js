/**
 * 配置文件
 */
module.exports = {
    // 数据库配置
    dbConfig: {
        // 测试环境数据库
        dev: {
            host: "localhost",
            user:"用户名",
            password:"密码",
            port: "端口",
            database: "数据库名" 
        },
        // 正式环境数据库
        pro: {
            host: "",
            user:"",
            password:"",
            port: "",
            database: ""
        }
    },
    // 测试使用
    mongodb:{
        url: '',
        database: "" 
    },
    // 域名
    baseUrl: {
        dev: '',
        pro: ''
    },
    // 阿里云上传图片配置
    aliConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        bucket: '',
        endpoint: ''
    },
    // token签名
    JWT_SCRECT: '',
    // token白名单
    unlessUrl:[
        '/api/user/login', '/api/recomend/lists', '/api/recent/lists', '/api/upload/oss', 
        '/api/user/logout', '/api/wxUser/wx/login', '/api/detail/info', '/api/user/register'],
    // token时效
    EXPIRESIN: '24h',
    // 小程序相关
    wxConfig: {
        appid: '',
        secret: ''
    }
}
