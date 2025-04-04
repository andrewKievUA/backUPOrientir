const Snap7 = require('node-snap7');
const cron = require('node-cron');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const config = require('./config.json'); // Импортируем конфигурацию

const connection = mysql.createPool(config.database);
const client = new Snap7.S7Client();

const downloadImage = require('./rezkaIntelect/downloadImage.js');

const cameras = [
    { url: 'http://192.168.60.45/cgi-bin/api.cgi?cmd=Snap&channel=0&stream=0&user=viewJ&password=abc_1234', label: '_1', side: 1 },
    { url: 'http://192.168.60.44/cgi-bin/api.cgi?cmd=Snap&channel=0&stream=0&user=viewJ&password=abc_1234', label: '_2', side: 2 }
];

const basePath = './rezkaIntelect/';
let previousValue = null;

client.ConnectTo('192.168.10.211', 0, 2, (err) => {
    if (err) {
        console.error('Error connecting to PLC:', err);
    } else {
        console.log('Connected to PLC');
    }
});

cron.schedule("*/1 * * * * *", async () => {
    try {
        if (!client.Connected()) {
            client.Disconnect();
            client.ConnectTo('192.168.10.211', 0, 2, (err) => {
                if (err) console.error('Error reconnecting to PLC:', err);
                else console.log('Reconnected to PLC');
            });
            return;
        }

        let currentValue = await new Promise((resolve, reject) => {
            client.DBRead(400, 22, 2, (err, data) => {
                if (err) return reject(err);

                let value = data.readInt16BE(0) - 1;
                resolve(value);
            });
        });

        if (previousValue === null || previousValue !== currentValue) {
            console.log(`Value changed: ${previousValue} -> ${currentValue}`);
            previousValue = currentValue;

            let today = new Date().toISOString().split('T')[0];
            let folderPath = path.join(basePath, today);

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                console.log(`Created directory: ${folderPath}`);
            }

            for (const camera of cameras) {
                let filename = `${currentValue}${camera.label}.jpg`;
                let fullPath = path.join(folderPath, filename);

                if (fs.existsSync(fullPath)) {
                    console.log(`File ${fullPath} already exists, skipping photo download.`);
                    continue;
                }

                await downloadImage(camera.url, fullPath, camera.side, filename);
                console.log(`Photo saved as ${fullPath}`);
            }
        }
    } catch (err) {
        console.log(err, "Error in cron job");
        client.Disconnect();
        client.Connect();
    }
});
