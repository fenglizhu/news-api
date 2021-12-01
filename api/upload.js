const express = require("express");
const router = express.Router();
const fs = require('fs');
var multer  = require('multer');
// 文件保存到本地的路径
var upload = multer({ dest: './uploads/' });
const { ossPut } = require('../utils/oss');
const { HttpException, SqlException } = require('../core/http-exceptions')

/**
 * 文件上传
 */
router.post("/oss",upload.single('file'),(req,res, next)=> {
    //路径是这样的 ./uploads/7ab3dda6330d4ff18c8a848abb0f3947
    let filePath = './' + req.file.path;
    // 文件类型
    var temp = req.file.originalname.split('.');
    var fileType = temp[temp.length - 1];
    var lastName = '.' + fileType;
    // 本地的文件路径 ./uploads/235ed4bccafa45ac85624e1abf1dbf26.jpg
    var fileName = './uploads/' + req.file.filename + lastName;
    try {
        /**
         * 图片重命名，不处理的话直接存的字符串，没有后缀名
         * 就是把 ./uploads/7ab3dda6330d4ff18c8a848abb0f3947
         * 重命名成 ./uploads/235ed4bccafa45ac85624e1abf1dbf26.jpg
         */
        fs.rename(filePath, fileName, async (err) => {
            if (err) {
                return next(new HttpException(202, '文件上传失败'))
            } else {
                ossPut({
                    key: 'kdnet/xcx/'+ req.file.filename + lastName,
                    path: fileName
                }).then(result=>{
                    // 删除本地文件
                    fs.unlinkSync(fileName);
                    if(result.res && result.res.status == 200) {
                        res.send({
                            code: 200,
                            data: result.url
                        })
                    } else {
                        return next(new HttpException(result.res.status, result.res.statusMessage))
                    }
                }).catch(error=>{
                    fs.unlinkSync(fileName);
                    return next(new HttpException(500,error.message))
                })
            }
        })
    } catch (error) {
        return next(new SqlException(600,error.message))
    }
});



module.exports = router;