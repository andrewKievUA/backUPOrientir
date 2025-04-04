// 'use strict';

// const axios = require('axios')
// const timeNaw = require("./timeNaw");

// const axiosModelSLV = require("./axiosModelSLV");
// const cron = require("node-cron");
// const { S7Client } = require("s7client");

// //Hi!Александр Славинский (sj39n1ndKk+UOtZjt4x0Iw==)',
// //me  FiFBOtd/Mz/Oo+5rlVKsyg==
// console.log("Started  ", timeNaw());
// const asp = {
//     hardware: {
//         name: "Sborshik",
//         host: "192.168.10.214",
//         port: 102,
//         rack: 0,
//         slot: 2,
//         maxRetryDelay: 1000,
//         alivePkgCycle: 10
//     },
// };

// let firstIteration = true
// let errorTimer = 0

// let oldData = ""
// let usrs = [  

//     "FiFBOtd/Mz/Oo+5rlVKsyg==", //YA
//     "sj39n1ndKk+UOtZjt4x0Iw=="// слв
// ]

// const client = new S7Client(asp.hardware);
// client.on("error", () => {
//     console.error;
//     return;
//   });


//   let usrs2 = [
//     "FiFBOtd/Mz/Oo+5rlVKsyg==", //YA
//     "IVKwDiqLpwBVwdov0hLnZw==", // ярик
// ]


// cron.schedule("0 * * * * *", () => {

//     if (errorTimer === 0) {

        
//         async function errorFunc() {
//             let res
           
//             try {
//                 //console.log("normalWorking")
//                  if (client.isConnected() === false) { 
//                     client.disconnect();
//                     await client.connect() }
//                 res = await client.readVars([{ area: "mk", type: "BYTE", start: 703 }]);
//                 res = res[0].value
//                 console.log("res",res);
//                 if (!res) { return }
//                 console.log(res, oldData, "data  ", timeNaw());
//                 client.disconnect()
//                 if (firstIteration === false) { oldData = res; firstIteration = true }
//                 if (oldData != res) {
//                     console.log(res, oldData, "Sending Messages", timeNaw());
//                     usrs.map(e => axiosModelSLV(e, res))
//                     oldData = res
//                 }
//             } catch (err) {
//                 console.log(err, "error Line");
//                  client.disconnect();
//                 await client.connect()
//                 errorTimer = 3
//                 return;
//             }
//         }
//         errorFunc()
//     }else {errorTimer--}
// })



// cron.schedule("0 57 19,7 * * *", () => {

// })

// cron.schedule("0 27 16 * * *", () => {
//     console.log( "Sending Messages to yarik and me", timeNaw());
//     usrs2.map(e => axiosModel(e, "asdfasdf"))

// })

//(party_popper)(party_popper)(party_popper)



'use strict';

const axios = require('axios');
const timeNaw = require("./timeNaw");
const axiosModelSLV = require("./axiosModelSLV");
const cron = require("node-cron");
const snap7 = require('node-snap7');

console.log("Started", timeNaw());

const client = new snap7.S7Client();
const asp = {
    hardware: {
        host: "192.168.10.214",
        rack: 0,
        slot: 2
    },
};

let firstIteration = true;
let errorTimer = 0;
let oldData = "";
const usrs = [  
    "FiFBOtd/Mz/Oo+5rlVKsyg==", // YA
    "sj39n1ndKk+UOtZjt4x0Iw==" // слв
];

async function checkPLC() {
    if (errorTimer > 0) {
        errorTimer--;
        return;
    }

    try {
        if (!client.Connected()) {
            client.Connect(asp.hardware.host, 102);
        }

        const buffer = Buffer.alloc(1); // Создаем буфер для чтения данных
        client.ReadArea(snap7.S7AreaMK, 0, 703, 1, buffer, (err) => {
            if (err) {
                throw err;
            }

            const value = buffer.readUInt8(0); // Читаем значение из буфера
            console.log("res", value);

            if (!value) {
                client.Disconnect();
                return;
            }

            console.log(value, oldData, "data", timeNaw());

            if (!firstIteration && oldData !== value) {
                console.log(value, oldData, "Sending Messages", timeNaw());
                usrs.forEach(e => axiosModelSLV(e, value));
            }

            oldData = value;
            firstIteration = false;

            client.Disconnect();
        });
    } catch (err) {
        console.error("Error during PLC operation:", err);
        client.Disconnect();
        errorTimer = 3;
    }
}

cron.schedule("0 * * * * *", checkPLC);
