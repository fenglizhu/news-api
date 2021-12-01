/**
 * http请求异常处理
 */

class HttpException extends Error {
    constructor(code = 500, msg = '服务器异常') {
        super();
        this.code = code;
        this.msg = msg;
    }
}

/**
 * 参数异常错误
 */
class PrameterException extends HttpException {
    constructor(code, msg) {
        super();
        this.code = code || 400;
        this.msg = msg || '参数错误'
    }
}

/**
 * 数据库异常错误
 */
 class SqlException extends HttpException {
    constructor(code, msg) {
        super();
        this.code = code || 600;
        this.msg = msg || '数据库操作异常'
    }
}


/**
 * 资源未找到异常错误
 */
 class NotFoundException extends HttpException {
    constructor(code, msg) {
        super();
        this.code = code || 412;
        this.msg = msg || '资源不存在'
    }
}


module.exports = {
    HttpException,
    PrameterException,
    SqlException,
    NotFoundException
}