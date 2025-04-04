'use strict';
const axios = require('axios');
const timeNaw = require("./timeNaw");
const axiosModel = require("./axiosModel");
const cron = require("node-cron");
const snap7 = require('node-snap7');
console.log("Started  ", timeNaw());

const asp = {
    hardware: {
        name: "Aspiration",
        host: "192.168.10.133",
        rack: 0,
        slot: 2,
        port: 102
    },
};

let firstIteration = false;
let errorTimer = 0;
let oldData = "";

let usrs = [

    "FiFBOtd/Mz/Oo+5rlVKsyg==", //YA
    "JK/VX+MSUkDjO1V/DYIg1Q==", // Николай енергетик
    "akGqSvSChKPujvRBdacEew==", // гумнюк
    "sj39n1ndKk+UOtZjt4x0Iw==", // slavinsk
    "91kgDvC/WPhttelZZrITow==", // Максим
    "QzdgH8J0AAX0d8wDpQPdmQ==", // Діма Благий
    "BrUPsORClgJMqoSrEYMcBQ==", // Максим
    "6pMjE81DtpbPAr+pRjswfw==", // Dmitriy  Hrihorenko

    "IVKwDiqLpwBVwdov0hLnZw==", // ярик
     "GQgzGweXkZ/glVKg5bPxXA==", // Oleg
     "Kq499BrgM+uUAnDkNs16Og==",// духно
    "nFhkukar97xi6q9YyDznhw==",// slava otk
    "9ANHiCXZqG3G8RAt56tU5g==", //Kostya
    "GcIM8lOzwgpbp+njykxmJQ==", // Ivan Cherkasov
     "V5tthDMqEs1PT/nCQpBgpw==", // Viktor
    "IPirRThqT5VC6pEtgtfgDg==", // Александр isaev
    "ulBn4UnvhVJ35zM1IVCXYw==",// Валентин: 
     "EveMeYA0xkdq1XK4LUBK3g==",// леша 1с

     "0ht677bzD9yGMq/EF5/wLA==",//Panasyuk Vladymir
     "xMj4L0q0OSns6DkyCkIBpg==",//Вадим
     "otbNvuKxAE9ss/K1VvYQlA==",//Александр Осьмак
    "bz1POC+bEk+N4IlEj9id2A==",//Dmytro
    "g4J84rOsZeZaetXmP6nJTA==",//ratush
     "Q6CHsKL2hR9aHZnGOOjl7g==", //елена
    "ENLI89rvLtuRUm2Fyr6MJw==",// Лиля

    //"IPrDMpwadYxr1JhskQUQfw==", //ирина
    // "BTqjdju0usLDL9MCSub9PA==",// Дима нач Ит


]


const client = new snap7.S7Client();

function connectToPLC() {
    return new Promise((resolve, reject) => {
        client.ConnectTo(asp.hardware.host, asp.hardware.rack, asp.hardware.slot, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function disconnectFromPLC() {
    client.Disconnect();
}

function readDataFromPLC() {
    return new Promise((resolve, reject) => {
        client.MBRead(150, 2, (err, res) => { // Чтение 2 байтов начиная с адреса 150
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

let usrs2 = [
    "FiFBOtd/Mz/Oo+5rlVKsyg==", // YA
    "IVKwDiqLpwBVwdov0hLnZw==", // Ярик
];

cron.schedule("*/30 * * * * *", () => {
    console.log("Started   ЕКН");
    if (errorTimer === 0) {
        async function errorFunc() {
            try {
                if (!client.Connected()) {
                    await connectToPLC();
                }

                let res = await readDataFromPLC();

                console.log(res);

                const buffer = Buffer.from(res); // Пример буфера с одним байтом

                const intValue = buffer.readUInt8(0); // Чтение первого байта как беззнаковое 8-битное целое число

                console.log(intValue); // Вывод: 15
                res =intValue
                //res = parseInt(res, 16)
                if (!res) { return; }

                // res = res.toString('hex'); // Преобразуем в строку для сравнения
                console.log(res, oldData, "data  ", timeNaw());

                if (firstIteration === false) {
                    oldData = res;
                    firstIteration = true;
                }

                if (oldData !== res) {
                    console.log(res, oldData, "Sending Messages", timeNaw());
                    usrs.map(e => axiosModel(e, res));
                    oldData = res;
                }

                disconnectFromPLC();

            } catch (err) {
                console.log(err, "error Line");
                disconnectFromPLC();
                errorTimer = 3;
                return;
            }
        }
        errorFunc();
    } else {
        errorTimer--;
    }
});



