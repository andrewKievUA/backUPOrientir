const axios = require('axios')
const Path = require('path')
var fs = require('fs')

async function downloadImageToLocalCamera(url) {
    // const url = `http://192.168.10.254:3000/camera`
    console.log("downloadImage",url)
    const path = Path.resolve("C:/rezka-params/viber_bot", 'images', `code1.jpg`)
    const writer = fs.createWriteStream(path)
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    await response.data.pipe(writer)
    return response
}

module.exports = downloadImageToLocalCamera