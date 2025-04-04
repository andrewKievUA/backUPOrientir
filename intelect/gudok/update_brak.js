const express = require('express');
const mysql = require('mysql');
const config = require('../config.json');

const app = express();
const port = 3053;
const connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return res.status(500).json({ error: 'Ошибка подключения к базе данных' });
    }


    app.get('/update-brak', (req, res) => {
        const { pallet, pallet_year, pallet_month } = req.query;

        console.log(pallet, pallet_year, pallet_month);


        // if (!pallet_number || !pallet_year || !pallet_month ) {
        //     return res.status(400).json({ error: 'Все параметры обязательны' });
        // }





        const query = `
 UPDATE p 
SET brak_persent_total = 
    CASE 
        WHEN cupsPallete > 0 THEN (num_defects * cubsStone / cupsPallete) * 100
        ELSE 0 
    END
WHERE pallet_number = ? AND pallet_year = ? AND pallet_month = ? AND id > 1000;

        `;

        connection.query(query, [pallet, pallet_year, pallet_month], (err, result) => {
            // connection.end();

            if (err) {
                console.error('Ошибка при обновлении:', err);
                return res.status(500).json({ error: 'Ошибка при обновлении' });
            }
            console.log(result);

            res.json({ message: 'Запись успешно обновлена', affectedRows: result.affectedRows });
        });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
