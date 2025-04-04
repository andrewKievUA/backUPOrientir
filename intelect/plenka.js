const express = require('express');
const mysql = require('mysql');
const config = require('./config.json'); // Импортируем конфигурацию
const app = express();
const cors = require('cors'); // Импортируем cors
const port = 3010; // Порт, который вы используете
const pool  = mysql.createPool(config.database);
const updateData1c = require("./mysqlfunc/updateData1c.js")
const axios = require('axios');
app.use(cors());

app.get('/send-number', async (req, res) => {
    try {
        // Извлекаем параметры запроса

        const cubicMetersStone = {
            100: 0.012,
            120: 0.0144,
            150: 0.018,
            200: 0.024,
            250: 0.03,
            280: 0.0336,
            300: 0.036,
            375: 0.045,
            400: 0.048,
            500: 0.06,
        };

        const cubicMeters = {
            100: 2.16,
            120: 2.16,
            150: 2.16,
            200: 2.16,
            250: 2.1,
            280: 2.016,
            300: 2.16,
            375: 1.8,
            400: 1.92,
            500: 1.8
        };
        const podon = req.query.podon;
        const plenka = req.query.plenka;
        const plenka_nomer = req.query.plenka_nomer;
        const plenka_partiya = req.query.plenka_partiya;
        let nom = req.query.nomen;
        const barcode = req.query.barcode;
        console.log(req.query);
        
        // Парсим паллет номер из barcode
        const p = parsePalletNumber(barcode);

        // Парсим номер из nom (должен быть в формате *число*)
        nom = nom.match(/\*(\d+)\*/)[1];
        console.log("2");
        // Выполняем запрос к базе данных для получения данных о дефектах
        //let defectMysqlResponse = await defectsMysql(pool , p.pallet, p.year, p.month);
        console.log("3");
        // Обновляем данные в 1С с использованием полученных данных о дефектах
        // calculateDefectRate(nom, defectMysqlResponse[0]['sum(rassloenie)']) // Рассчитываем процент брака
         updateData1c(
            nom,
            podon,
            plenka,
            plenka_nomer,
            plenka_partiya,
            pool ,
            p.pallet,
            p.year,
            p.month,
            cubicMetersStone[nom],
            req.query.smena,
            cubicMeters[nom]

            
        );

         sendRequest(p.pallet,  p.year, p.month);// перепроверка процента брака

        // Возвращаем успешный ответ
         res.json({ message: 'Запрос успешно обработан' });

    } catch (error) {
        // Обрабатываем ошибки и возвращаем ответ с ошибкой сервера
        console.error('Ошибка в обработке запроса:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});



const sendRequest = (pallet, pallet_year, pallet_month) => {
    setTimeout(async () => {
            const response = await axios.get('http://localhost:3053/update-brak', {
                params: {
                    pallet,
                    pallet_year,
                    pallet_month
                }
            }) 
    }, 3000); // 3000 миллисекунд = 3 секунды
};





// Маршрут для обработки GET-запроса с параметрами
app.get('/send-check', (req, res) => {
    console.log(req.query);
    const checkPoint_Diff = req.query.checkPoint_Diff;
    const numberTrackingPalete = req.query.numberTrackingPalete;
    chech_diff(checkPoint_Diff, numberTrackingPalete)
    res.json({ message: 'Запрос успешно обработан' })
});




function parsePalletNumber(palletNumber) {
    const year = "20" + palletNumber.slice(0, 2);        // Первые 4 цифры - год
    const month = palletNumber.slice(2, 4);       // Следующие 2 цифры - месяц
    const day = palletNumber.slice(4, 6);         // Следующие 2 цифры - день
    let pallet = palletNumber.slice(6);         // Остальные цифры - номер палеты

    if (pallet.startsWith('00')) { pallet = pallet.slice(2); }
    if (pallet.startsWith('0')) { pallet = pallet.slice(1); }

    return {
        year,
        month,
        day,
        pallet
    };
}


const chech_diff = (checkPoint_Diff, numberTrackingPalete) => {
    console.log("startes", checkPoint_Diff);
    let q = ` INSERT INTO pallet_db.check (checkPoint_Diff, numberTrackingPalete) VALUES ('${checkPoint_Diff}', '${numberTrackingPalete}')`

    // console.log(q);
    pool.query(q, (error, results) => {
        if (error) {
            console.error('Ошибка при вставке данных:', error);
            return;
        }
        // res.json({ message: 'Запрос успешно обработан' });
        // console.log('Данные успешно вставлены:', results);
    });
};



app.get('/api/pallets', (req, res) => {
    
    
    const { day, month, year } = req.query; // Используем параметры для фильтрации
    console.log( day, month, year);
    const query = `
        SELECT id, time, checkPoint_Diff, numberTrackingPalete, printerNumber, day, month, year
        FROM pallet_db.check
        WHERE day = ? AND month = ? AND year = ?
        order by id desc`;

        pool.query(query, [day, month, year], (err, results) => {
        if (err) throw err;
        console.log( results);
        res.json(results);
    });
});

app.get('/analytics-all', (req, res) => {
    const palletNumberFrom = parseInt(req.query.pallet_number_from, 10);
    const palletNumberTo = parseInt(req.query.pallet_number_to, 10);
    const palletYear = parseInt(req.query.pallet_year, 10);
    const palletMonth = parseInt(req.query.pallet_month, 10);
    const side = req.query.side;

    // SQL-запрос
    const sql = `
        SELECT type_1c, brak_persent_total, pallet_number, timestamp, num_defects, smena,id , massivePart
        FROM pallet_db.p 
        WHERE 
            pallet_number >= ? 
            AND pallet_number <= ? 
            AND pallet_year = ? 
            AND pallet_month = ? 
            AND side = ?;
    `;

    // Выполните запрос к базе данных
    pool.query(sql, [palletNumberFrom, palletNumberTo, palletYear, palletMonth, side], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса: ', error);
            return res.status(500).json({ error: 'Ошибка выполнения запроса' });
        }
        // Отправьте результат клиенту
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(results);
    });
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
