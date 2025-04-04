const timeNaw = require("./timeNaw");
const axios = require('axios')

function axiosModel(receiver,res){ 
    res = createBinaryString(res).slice(26)
    console.log(res, "inside axios after formating")
    axios.post('https://chatapi.viber.com/pa/send_message', {
    "receiver":receiver ,
    "min_api_version": 7,
    "type": "text",
    "text": 
      " Ввод85= "+ vvod1(res[5])+ vvod2(res[4])+
    "\n Ввод90= "+ vvod1(res[3])+ vvod2(res[2])+
     gen1(res[1])+ gen2(res[0]), 

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
    if(i==0){return "🔴"}
    if(i==1){return "🟢"}
}

function vvod2(i){
    if(i==0){return ""}
    if(i==1){return "(В роботi)"}
}

function gen1(i){
    if(i==0){return ""}
    if(i==1){return "\n ДГ1⚡  "}
}

function gen2(i){
    if(i==0){return ""}
    if(i==1){return "ДГ2⚡ (В роботi)"}
}

function createBinaryString(nMask) {
    // nMask must be between -2147483648 and 2147483647
    for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
        nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
    return sMask;
}

module.exports = axiosModel