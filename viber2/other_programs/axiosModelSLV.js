const axios = require('axios')

function axiosModelSLV(receiver,res){ 
    res = createBinaryString(res).slice(26)
    console.log(res, "inside axios after formating")



    axios.post('https://chatapi.viber.com/pa/send_message', {
    "receiver":receiver ,
    "min_api_version": 7,
    "type": "text",
    "text": 
      " Смазка= "+ vvod1(res[5]),

    "auth_token": "506ff3cfba27e13b-1fd904b59d1e22ac-610e42d83e1d06af",
    "sender": {
        "name": "Andrew",
        "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVUEHs-NQ0wKtnQ23SIMDTUj04O6MZRTlh1VWzWhA&s"
    },
})
    .then(function (response) {
        console.log(response.data.status_message);
    })
    .catch(async function (error) {
        console.log(error);
        console.log("bugagaga")	
        return
    });
}


function vvod1(i){
    if(i==0){return "🟢"}
    if(i==1){return "🔴"}
}

function createBinaryString(nMask) {
    // nMask must be between -2147483648 and 2147483647
    for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
        nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
    return sMask;
}

module.exports = axiosModelSLV