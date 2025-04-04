const axios = require('axios')
const Path = require('path')
var fs = require('fs')


async function downloadImageToLocal(screenNumber,ip) {

   
    const url = `http://192.168.10.${ip}:3000/screen${screenNumber}`
    console.log("downloadImage",url)
    const path = Path.resolve("C:/rezka-params/viber_bot", 'images', `code${screenNumber}.jpg`)
    const writer = fs.createWriteStream(path)
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    await response.data.pipe(writer)
    return response
}



module.exports = downloadImageToLocal