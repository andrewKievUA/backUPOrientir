'use strict';
const Snap7 = require('node-snap7');
const cron = require('node-cron');
const Path = require('path');
const { folderSelector } = require('./belltrans/folderSelector.js');
const axios = require('axios');
// const { mainUpdatePlenkaSize } = require('./mssqlCHeckUpdate/mainCheckUpdatePlenkaSize.js');
const { chech_diff } = require('./belltrans/chech_diff.js');

console.log("Started  ",);
const mysql = require('mysql');
const config = require('./config.json'); // Импортируем конфигурацию
const cors = require('cors'); // Импортируем модуль cors
const fs = require('fs');
const brakCalc = require("./belltrans/brakCalc.js")
const calcBrakTotal = require("./belltrans/calcBrakTotal.js")



// Создаем подключение к базе данных
const connection = mysql.createPool(config.database);

const client = new Snap7.S7Client();
client.ConnectTo('192.168.10.216', 0, 2, (err) => {
    if (err) {
        console.error('Error connecting to PLC:', err);
    } else {
        console.log('Connected to PLC');
    }
});


let printerNumberOld = 0, printerNumber = 0, errorTimer = 0, oldData = 0, massivePart = 0, firstIteration = false;


cron.schedule("*/1 * * * * *", async () => {
    if (errorTimer === 0) {
        try {
            if (!client.Connected()) {
                client.Disconnect();
                client.Connect();
            }
            let res = await new Promise((resolve, reject) => {
                client.DBRead(622, 114, 14, (err, data) => {
                    if (err) return reject(err);
                    // console.log("data",data.readUInt16BE(4) );

                    let value = data.readInt32BE(0) - 1;
                    printerNumber = data.readInt32BE(4)
                    massivePart = data.readInt16BE(8)
                    const checkpoint = data.readInt16BE(10)
                    const diffNumber = data.readInt16BE(12)
                    //console.log(massivePart,"_",value,"_",checkpoint,"_",diffNumber);

                    if (checkpoint !== 0) {
                        chech_diff(client, connection, checkpoint, value, printerNumber,diffNumber);
                    }
                    resolve(value);
                });
            });

            if (!res) return;
            // console.log(res, oldData, massivePart);

            if (firstIteration === false) {
                oldData = res;
                printerNumberOld = printerNumber
                firstIteration = true;
            }
            if (printerNumberOld !== printerNumber) {

                // console.log("mainUpdatePlenkaSize");

                // mainUpdatePlenkaSize(connection)
                printerNumberOld = printerNumber
            }

            if (oldData !== res) {
                const { downloadImage, sendImage } = require('./belltrans/imageProcessor');

                (async () => {
                    try {
                        // Путь для оригинальных изображений
                        const originalImagePath = Path.join(folderSelector(res), `${res}_A.jpg`);
                        const originalImagePath_с = Path.join(folderSelector(res), `${res}_C.jpg`);

                        // Параллельная загрузка изображений
                        const results = await Promise.all([
                            // downloadImage('http://192.168.10.47:3011/snapshot', originalImagePath,1),
                            downloadImage('http://192.168.60.145/cgi-bin/api.cgi?cmd=Snap&channel=0&stream=0&user=viewJ&password=abc_1234', originalImagePath, 1, `${res}_A.jpg`, connection),
                            downloadImage('http://192.168.60.144/cgi-bin/api.cgi?cmd=Snap&channel=0&stream=0&user=viewJ&password=abc_1234', originalImagePath_с, 2, `${res}_C.jpg`, connection)
                        ]);
                        let calcs = brakCalc(results[0], results[1])
                        console.log("results[0]", results[0]);
                        console.log("results[1]", results[1]);
                        console.log("res[0]", calcs);

                        // console.log('bell trans',results);
                        // Параллельная отправка изображений в нейросеть
                        await Promise.all([
                            sendImage(originalImagePath, res, connection, "B", results[0], calcs, massivePart),
                            sendImage(originalImagePath_с, res, connection, "D", results[1], calcs, massivePart)
                        ]);
                        await calcBrakTotal(res, connection)
                        axios.get('http://192.168.10.44:3033/check-signal');



                    } catch (error) {
                        console.error('An error occurred:', error.message);
                    }
                })();



                console.log("Sending Messages");
                oldData = res;
            }
        } catch (err) {
            console.log(err, "error Line");
            client.Disconnect();
            client.Connect();
            errorTimer = 3;
        }
    } else {
        errorTimer--;
    }
});



const express = require('express');
const path = Path
const app = express();
const port = 3069;
app.use(cors());
app.use(express.json());

// Путь к корневой директории с фото
function getCalculatedFolder(paletteNumber) {
    let calculatedFolder = Math.floor((parseInt(paletteNumber, 10) / 1000)) * 1000;
    return String(calculatedFolder);
}

const basePhotoPath = 'D:/photo';

// Маршрут для обработки запросов на получение фото
app.get('/photo/:year/:month/:paletteNumber/:type', (req, res) => {
    const { year, month, paletteNumber, type } = req.params;

    // Формируем полный путь к файлу
    const photoPath = path.join(basePhotoPath, year, month, getCalculatedFolder(paletteNumber), `${paletteNumber}_${type}.jpg`);
    // Отправляем файл в ответ на запрос
    res.sendFile(photoPath, (err) => {
        if (err) {
            console.error(`Ошибка при отправке файла: ${err}`);
            res.status(404).send('Файл не найден');
        }
    });
});


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Маршрут для обработки запросов на получение фото
app.get('/photo/:year/:month/:paletteNumber/:type', (req, res) => {
    const { year, month, paletteNumber, type } = req.params;
    // Формируем полный путь к файлу
    const photoPath = path.join(basePhotoPath, year, month, getCalculatedFolder(paletteNumber), `${paletteNumber}_${type}.jpg`);
    // Отправляем файл в ответ на запрос
    res.sendFile(photoPath, (err) => {
        if (err) {
            console.error(`Ошибка при отправке файла: ${err}`);
            res.status(404).send('Файл не найден');
        }
    });
});




app.get('/info/:year/:month/:paletteNumber/:type', (req, res) => {
    const clientIp = req.ip; // Получаем IP-адрес клиента
    console.log(`Запрос от IP: ${clientIp}`);

    // Получаем параметры и преобразуем их в целые числа
    const year = parseInt(req.params.year, 10);
    const month = parseInt(req.params.month, 10);
    const paletteNumber = parseInt(req.params.paletteNumber, 10);
    const type = req.params.type;  // 'type' можно оставить как строку

    // Формируем строку SQL вручную с подстановкой параметров  rassloenie, skol, treshina, ugolok_treshina, vidbutosti, zaterto_valami, vidbutosti_200, timestamp, type,num_stones,brak_persent, brak_persent_total
    const query = `
      SELECT *
      FROM pallet_db.p 
      WHERE pallet_number = ${paletteNumber} AND pallet_year = ${year} AND pallet_month = ${month} AND side = '${type}'
    `;

    // console.log(query);  // Логируем строку запроса

    // Выполняем запрос
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса: ', err);
            res.status(500).json({ error: 'Ошибка выполнения запроса' });
            return;
        }

        //   console.log(results);

        // Отправляем результаты клиенту
        res.json(results);
    });
});





app.get('/study/:year/:month/:paletteNumber/:type/:nulls', (req, res) => {
    console.log(req.params);

    let { year, month, paletteNumber, type, nulls } = req.params;
    if (nulls === undefined) { nulls = 0 }

    // Путь к исходному файлу
    const sourceFilePath = path.join('D:', 'photo', year, month, getCalculatedFolder(paletteNumber), `${paletteNumber}_${type}.jpg`);

    // Путь к директории, куда будет сохранено фото
    let destinationDir
    if (nulls == 2) { destinationDir = path.join('D:', `study/${type}/`); }
    if (nulls == 1) { destinationDir = path.join('D:', `study/null/${type}/`); }

    // Проверка существования файла
    fs.access(sourceFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Файл не найден:', sourceFilePath);
            return res.status(404).json({ message: 'Файл не найден' });
        }

        // Убедиться, что целевая директория существует, или создать её
        if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir, { recursive: true });
        }

        // Копирование файла
        const destinationFilePath = path.join(destinationDir, `${paletteNumber}_${type}.jpg`);
        fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
            if (err) {
                console.error('Ошибка при копировании файла:', err);
                return res.status(500).json({ message: 'Ошибка при копировании файла' });
            }

            console.log(`Файл успешно скопирован в: ${destinationFilePath}`);
            res.json({ message: 'Файл успешно скопирован' });
        });
    });
});

app.get('/studyNull/:year/:month/:folder/:palletNumber', (req, res) => {
    const { year, month, folder, palletNumber } = req.params;

    // Путь к исходному файлу
    const sourceFilePath = path.join('D:', 'photo', year, month, folder, `${palletNumber}`);

    // Путь к директории, куда будет сохранено фото
    const destinationDir = path.join('D:', 'studyNull');

    // Проверка существования файла
    fs.access(sourceFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Файл не найден:', sourceFilePath);
            return res.status(404).json({ message: 'Файл не найден' });
        }

        // Убедиться, что целевая директория существует, или создать её
        if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir, { recursive: true });
        }

        // Копирование файла
        const destinationFilePath = path.join(destinationDir, `${palletNumber}`);
        fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
            if (err) {
                console.error('Ошибка при копировании файла:', err);
                return res.status(500).json({ message: 'Ошибка при копировании файла' });
            }

            console.log(`Файл успешно скопирован в: ${destinationFilePath}`);
            res.json({ message: 'Файл успешно скопирован' });
        });
    });
});

app.use('/getNumber', (req, res) => {
    res.json({ number: oldData });
});




// Запуск сервера
app.listen(port,'0.0.0.0', () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});








