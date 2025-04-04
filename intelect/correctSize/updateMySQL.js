const mysql = require('mysql');

// Функция для обновления type_1c в базе данных MySQL
function updateType1cInMySQL(discrepancies, connection) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    let updateQuery = `UPDATE p SET type_1c = CASE\n`;

    // Формируем конструкцию CASE только для pallet_number из discrepancies
    discrepancies.forEach(({ pallet_number, mssql_type_1c }) => {
        updateQuery += `    WHEN pallet_number = '${pallet_number}' THEN '${mssql_type_1c}'\n`;
    });

    updateQuery += `END\n`;
    updateQuery += `WHERE pallet_month = ${currentMonth} AND pallet_year = ${currentYear}\n`;
    updateQuery += `AND pallet_number IN (${discrepancies.map(({ pallet_number }) => `'${pallet_number}'`).join(', ')});`;

    console.log('Запрос для обновления:\n', updateQuery);

    connection.query(updateQuery, (err, results) => {
        if (err) {
            console.error('Ошибка при обновлении:', err);
        } else {
            console.log('Обновления успешно выполнены:', results);
        }
    });
}

// Экспортируем функции
module.exports = {
    updateType1cInMySQL
};
