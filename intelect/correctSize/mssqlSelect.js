// Импортируем модуль для работы с MS SQL
const sql = require('mssql');

// Конфигурация подключения к базе данных MS SQL
const config = {
    user: 'otk_user', // Имя пользователя
    password: 'otk123user', // Пароль пользователя
    server: '192.168.10.245\\SQLEXPRESS', // Адрес сервера и экземпляр SQL
    database: 'logopack', // Имя базы данных
    requestTimeout: 300000, // Время ожидания выполнения запроса
    options: {
        encrypt: false, // Отключение шифрования для подключения
        enableArithAbort: true // Включение аритметических проверок на ошибки
    }
};

// Функция для получения и фильтрации данных из базы данных MS SQL
async function getFilteredBarcodeHistory(number) {
    try {
        // Устанавливаем подключение к базе данных MS SQL
        await sql.connect(config);

        // Выполняем запрос для получения данных
        const result = await sql.query(`

            SELECT  top ${number} DescriptionNomenclature, Barcode
            FROM dbo.PalleteDataHistory 
            order by DT desc
        `);

        // Обрабатываем данные, удаляя все до первой звездочки и после второй звездочки
        const filteredData = result.recordset.map(item => {
            const input = item.DescriptionNomenclature;
            const filteredResult = input.replace(/^.*?\*|\*.*$/g, ''); // Оставляем текст между звёздочками
            return {
                pallet_number: parseInt(item.Barcode.slice(6),10),
                type_1c: filteredResult, // Оставляем обработанный результат
            };
        });

        // Возвращаем отфильтрованные данные
        return filteredData;
    } catch (err) {
        // Логируем ошибку, если запрос не удался
        console.error('Ошибка выполнения запроса:', err);
    } finally {
        // Закрываем соединение с базой данных
        await sql.close();
    }
}

// Экспортируем функцию для использования в других модулях
module.exports = {
    getFilteredBarcodeHistory
};
