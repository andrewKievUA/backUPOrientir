const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dflu2shrc",
    api_key: "374367528427555",
    api_secret: "iWetRBXkb8bVOP7Bfnj9GsKllQE"
});

 function downloadImageTowebSecondScreen(screenNumber) {
    console.log("DownloadImageToTheCloud",screenNumber)
       const res  = cloudinary.uploader.upload(`C:/rezka-params/viber_bot/images/code${screenNumber}.jpg`, {
            public_id: screenNumber,
            overwrite: true,
            transformation: {
                fetch_format: "jpg"
            }
        })
        res.then((data) => {
            //   console.log(data);
            console.log(data.secure_url, "inside function");
            return data.secure_url
    
        }).catch((err) => {
            console.log(err,"catch1");
        })
            .catch(function (error) {
                
                console.log(error,"catch2");
                return 
            })

    return res

}



module.exports = downloadImageTowebSecondScreen