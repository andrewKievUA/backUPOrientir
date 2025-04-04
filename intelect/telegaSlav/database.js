// telegaSlav/database.js
const mysql = require('mysql');
const config = require('../config.json'); // Adjust path to config

const connection = mysql.createConnection(config.database);

connection.connect(err => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключено к базе данных');
});

const executeQuery = (query, callback) => {
    connection.query(query, callback);
};

process.on('SIGINT', () => {
    connection.end(err => {
        if (err) {
            console.error('Ошибка при отключении от базы данных:', err);
        } else {
            console.log('Отключено от базы данных');
        }
        process.exit();
    });
});

module.exports = { executeQuery };
