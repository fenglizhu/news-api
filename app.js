const express = require('express');
const app = express();
const port = 3000;

// express 路由
const router = require('./router/index');
const { logErrors , clientErrorHandler, catchError} = require('./middleware/exception');
const { expressJwt, tokenValidate } = require('./middleware/token-validate')

// 解决跨域
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
    next();
});

// 获取post方法body参数
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// token校验
app.use(expressJwt(),tokenValidate);

// 路由注册
// TODO: 
app.use('/api', router);

// 全局异常处理
app.use(logErrors, clientErrorHandler,catchError)



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})