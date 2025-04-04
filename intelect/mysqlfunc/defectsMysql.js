const defectsMysql = (connection, barcode, pallet_year, pallet_month) => {
  return new Promise((resolve, reject) => {
      let q = `
      SELECT sum(rassloenie) FROM pallet_db.p 
      WHERE pallet_number = ${barcode}
      AND pallet_year = ${pallet_year}
      AND pallet_month = ${pallet_month}
      `;
      // console.log(q);

      // Выполняем запрос
      connection.query(q, (error, results) => {
          if (error) {
              return reject(error); // В случае ошибки отклоняем промис
          }
          // console.log(results);
          resolve(results); // В случае успеха возвращаем результат
      });
  });
};

module.exports = defectsMysql;
