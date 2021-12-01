/**
 * 异常处理中间件
 */

const logErrors = (err, req, res, next) =>{
    next(err)
}

const clientErrorHandler = (err, req, res, next) =>{
    // 请注意，当不在错误处理函数中调用"next"时，您负责编写（和结束）响应。否则，这些请求将“挂起”并且没有资格进行垃圾回收。
    if (req.xhr) {
        res.status(500).send({ error: 'Server Error!' })
    } else {
        next(err)
    }
}

const catchError = (err, req,res,next) =>{
    res.send({
        code: err.code,
        msg: err.msg
    })
}

module.exports = {
    logErrors,
    clientErrorHandler,
    catchError
}