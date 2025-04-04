const mysql = require('mysql');

// Настройки подключения
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'pallet_user',
    password: 'pallet_password',
    database: 'pallet_db'
});

// Подключение к базе данных
connection.connect((err) => {
    if (err) {
        console.error('Ошибка подключения: ' + err.stack);
        return;
    }
    console.log('Подключено как id ' + connection.threadId);
});

// Запрос
const query = `
    SELECT pallet_number  pallet_year pallet_month  FROM pallet_db.p
    WHERE type_1c = 0
    ORDER BY id DESC
    LIMIT 100 OFFSET 20
`;

connection.query(query, (err, results) => {
    if (err) {
        console.error('Ошибка запроса: ' + err.stack);
        return;
    }
    console.log('Результаты:', results);
});

// Закрытие соединения
connection.end();
