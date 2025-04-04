const express = require('express');
const mysql = require('mysql');
const snap7 = require('node-snap7');
const config = require('../config.json'); // Импортируем конфигурацию

const app = express();
const port = 3033;

// Создание подключения к базе данных
const connection = mysql.createConnection(config.database);

// Функция для отправки сигнала на микроконтроллер
function sendSignal() {
    console.log("send signal");

    const client = new snap7.S7Client();
    client.ConnectTo('192.168.10.216', 0, 2, (err) => {
        if (err) {
            console.error('Error connecting to PLC:', err);
        } else {
            console.log('Connected to PLC');
        }
    });

    console.log("send signal2");
    const buffer = Buffer.alloc(1); // Создаем буфер размером 1 байт
    buffer.writeUInt8(1, 0); // Записываем логическую единицу в первый байт
    client.MBWrite(547, buffer.length, buffer, (err) => { // Запись в адрес 0 (или измените на нужный вам адрес)
        if (err) {
            console.error('Ошибка записи:', err);
        } else {
            console.log('Сигнал отправлен на микроконтроллер');
        }
        client.Disconnect();
    });
}

// Обработка GET-запроса
app.get('/check-signal', (req, res) => {
    // Запрос на получение максимального id
    connection.query('SELECT MAX(id) as maxId FROM p', (error, results) => {
        if (error) {
            console.error('Ошибка при выполнении запроса:', error);
            res.status(500).send('Ошибка при получении данных из базы.');
            return;
        }

        const maxId = results[0].maxId;
        console.log(`Проверка палеты с максимальным id: ${maxId}`);

        // Получаем значение brak_persent_total для максимального id
        connection.query('SELECT brak_persent_total FROM p WHERE id = ?', [maxId], (error, results) => {
            if (error) {
                console.error('Ошибка при выполнении запроса:', error);
                res.status(500).send('Ошибка при получении данных из базы.');
                return;
            }

            if (results.length > 0) {
                const brakPersentTotal = results[0].brak_persent_total;

                if (brakPersentTotal > 5) {
                    sendSignal(); // Отправка сигнала на микроконтроллер
                    res.send(`Сигнал отправлен для палеты с ID ${maxId}.`);
                } else {
                    res.send(`brak_persent_total для палеты ${maxId} не превышает 5%.`);
                }
            } else {
                res.send(`Палета с ID ${maxId} не найдена.`);
            }
        });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
