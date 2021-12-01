/**
 * 加密解密
 */
var CryptoJS = require('crypto-js');
var sha256 = require("crypto-js/sha256")

// 加密
const encrypt = (word,keyStr) => {
    keyStr = keyStr ? keyStr : '78niaoshuhui6542';  // 密钥
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs,key,{
        mode:CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
}
// 解密
const decrypt = (word,keyStr) => {
    keyStr = keyStr ? keyStr : '78niaoshuhui6542';  // 密钥
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var decrypt = CryptoJS.AES.decrypt(word,key,{
        mode:CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/*
* 根据账号 返回一个10位随机加密字符串的方法
* function 
* @param {string} phone
*/
const initUsername = (username) => {
    let data = sha256(username + new Date().getTime().toString())
	return data.words[0]
}

module.exports = {
    encrypt,
    decrypt,
    initUsername
}