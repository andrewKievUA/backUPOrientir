module.exports = function missedSize(mysqlPool) {
  const query = `
    SELECT pallet_number FROM pallet_db.p 
    WHERE timestamp >= NOW() - INTERVAL 1 DAY 
      AND type_1c = 0
      AND side = "B"
    ORDER BY ID DESC;
  `;

  return new Promise((resolve, reject) => {
    mysqlPool.query(query, (err, results) => {
      if (err) {
        console.error('Ошибка выполнения запроса: ' + err.message);
        reject(err); // Отклоняем промис при ошибке
      } else {
        // Извлекаем только pallet_number из результатов
        const palletNumbers = results.map(row => row.pallet_number);
        // console.log('Полученные номера поддонов:', palletNumbers);
        resolve(palletNumbers); // Возвращаем только массив номеров поддонов
      }
    });
  });
};
