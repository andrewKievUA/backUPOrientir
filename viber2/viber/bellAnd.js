// 'use strict';

// const axios = require('axios')
// const timeNaw = require("./timeNaw");

// const axiosModelSLV = require("./axiosModelAndr");
// const cron = require("node-cron");
// const { S7Client } = require("s7client");

// //Hi!Александр Славинский (sj39n1ndKk+UOtZjt4x0Iw==)',
// //me  FiFBOtd/Mz/Oo+5rlVKsyg==
// console.log("Started  ", timeNaw());
// const asp = {
//     hardware: {
//         name: "LC",
//         host: "192.168.10.211",
//         port: 102,
//         rack: 0,
//         slot: 2,
//         maxRetryDelay: 1000,
//         alivePkgCycle: 10
//     },
// };
// let errorTimer = 0

// // if (sender_id === "IPirRThqT5VC6pEtgtfgDg==") {sender_name = "Исаев"}
// // if (sender_id === "91kgDvC/WPhttelZZrITow==") {sender_name = "Добряков"}


// let oldData = ""
// let usrs = [  
//     // "IPirRThqT5VC6pEtgtfgDg==",
//     // "91kgDvC/WPhttelZZrITow==",
//     // "IVKwDiqLpwBVwdov0hLnZw=="  // YARIK
// //    "FiFBOtd/Mz/Oo+5rlVKsyg==", //YA
// ]

// const client = new S7Client(asp.hardware);
// client.on("error", () => {
//     console.error;
//     return;
//   });

// cron.schedule("0 * * * * *", () => {
//     if (errorTimer === 0) {
//         async function errorFunc() {
//             let res
//             try {
//                 //console.log("normalWorking")
//                  if (client.isConnected() === false) { 
//                     client.disconnect();
//                     await client.connect() }
//                 res = await client.readVars([{ area: "mk", type: "BOOL", start: 280, bit:0 }]);
//                 res = res[0].value
//                 console.log("res",res);
//                 if (!res) { return }
//                 console.log(res, oldData, "data  ", timeNaw());
//                 client.disconnect()
//                     console.log(res, oldData, "Sending Messages", timeNaw());
//                     usrs.map(e => axiosModelSLV(e, res))

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
'use strict';

const axios = require('axios');
const timeNaw = require("./timeNaw");
const axiosModelSLV = require("./axiosModelAndr");
const cron = require("node-cron");
const snap7 = require('node-snap7');

console.log("Started", timeNaw());

const client = new snap7.S7Client();
const asp = {
    hardware: {
        host: "192.168.10.211",
        rack: 0,
        slot: 2
    },
};

let errorTimer = 0;
let oldData = "";
const usrs = [
    // "IPirRThqT5VC6pEtgtfgDg==",
    // "91kgDvC/WPhttelZZrITow==",
    // "IVKwDiqLpwBVwdov0hLnZw==", // YARIK
    // "FiFBOtd/Mz/Oo+5rlVKsyg==", // YA
];

cron.schedule("0 * * * * *", () => {
    if (errorTimer === 0) {
        async function errorFunc() {
            try {
                if (!client.Connected()) {
                    client.Connect(asp.hardware.host, 102);
                }
                
                // Чтение переменной BOOL из области MK
                const buffer = Buffer.alloc(1); // Буфер для чтения
                client.ReadArea(snap7.S7AreaMK, 0, 280, 1, buffer, (err, res) => {
                    if (err) throw err;
                    const value = buffer.readUInt8(0);
                    console.log("res", value);

                    if (!value) return;

                    console.log(value, oldData, "data", timeNaw());
                    client.Disconnect();
                    console.log(value, oldData, "Sending Messages", timeNaw());
                    usrs.map(e => axiosModelSLV(e, value));
                });
            } catch (err) {
                console.log(err, "error Line");
                client.Disconnect();
                errorTimer = 3;
                return;
            }
        }
        errorFunc();
    } else {
        errorTimer--;
    }
});
