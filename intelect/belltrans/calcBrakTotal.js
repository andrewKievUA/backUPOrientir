const mysql = require('mysql');

const calcBrakTotal = async (res, connection) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяц +1, так как в JS месяцы начинаются с 0

    const query = `
    UPDATE p
    JOIN (
        SELECT pallet_number, pallet_year, pallet_month, SUM(brak_persent) AS total_brak_persent
        FROM p
        WHERE pallet_number = ${res}
          AND pallet_year = ${year}
          AND pallet_month = ${month}
    ) AS subquery
    ON p.pallet_number = subquery.pallet_number
      AND p.pallet_year = subquery.pallet_year
      AND p.pallet_month = subquery.pallet_month
    SET p.brak_persent_total = subquery.total_brak_persent
    WHERE p.pallet_number = ${res}
      AND p.pallet_year = ${year}
      AND p.pallet_month = ${month};
    `;

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Ошибка выполнения запроса:', error);
                reject(error); // Отказываем промис в случае ошибки
            } else {
                console.log('Запрос успешно выполнен: SUM(brak_persent) AS total_brak_persent');
                resolve(results); // Успешное выполнение запроса
            }
        });
    });
};

module.exports = calcBrakTotal;
