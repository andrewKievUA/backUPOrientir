// Функция для получения данных по PalletNumber с динамическим значением диапазона
function getPalletData(minPalletNumber, maxPalletNumber, pool, callback) {
    // Получаем текущий год и месяц
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1

    // SQL-запрос для получения данных по PalletNumber с переданным диапазоном
    const query = `
        SELECT pallet_number, type_1c
        FROM pallet_db.p
        WHERE pallet_number BETWEEN ${maxPalletNumber} AND ${minPalletNumber}
        AND pallet_year = ${currentYear} 
        AND pallet_month = ${currentMonth}
        AND side = 'B'
        ORDER BY id DESC
    `;

    // Логируем строку запроса с подставленными значениями
    console.log('Выполняемый запрос: ', query);

    // Выполнение запроса через пул
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            callback(err, null);
            return;
        }

        // Преобразуем результат в обычный массив
        const simplifiedResults = results.map(row => ({
            pallet_number: row.pallet_number,
            type_1c: row.type_1c
        }));

        // Возвращаем результаты через callback
        callback(null, simplifiedResults);
    });
}

// Экспортируем функцию
module.exports = {
    getPalletData
};
