/**
 * 获取图片大小，主要是为了在小程序端做瀑布流作用
 */
const https = require('https')
const sizeOf = require('image-size');
const imageSize = (url) =>{
    const options = new URL(url)
    return new Promise((resolve)=>{
        https.get(options, (response) => {
            const chunks = []
            response.on('data', (chunk) => {
                chunks.push(chunk)
            }).on('end', () => {
                const buffer = Buffer.concat(chunks)
                let img = sizeOf(buffer)
                let coverObj = {
                    coverWidth: img.width,
                    coverHeight: img.height
                }
                resolve(coverObj)
            })
        })
    })
    
}

module.exports = imageSize