const updateData1c = async (type_1c, podon, plenka, plenka_nomer, plenka_partiya, pallet_number, pallet_year, pallet_month, cubsStone, smena, cupsPallete, connection) => {
  const query = `
    UPDATE pallet_db.p p
    JOIN (
      SELECT pallet_number, pallet_year, pallet_month, 
             SUM(IFNULL(rassloenie, 0)) AS total_defects
      FROM pallet_db.p
      WHERE pallet_number = ?
        AND pallet_year = ?
        AND pallet_month = ?
      GROUP BY pallet_number, pallet_year, pallet_month
    ) AS subquery
    ON p.pallet_number = subquery.pallet_number
      AND p.pallet_year = subquery.pallet_year
      AND p.pallet_month = subquery.pallet_month
    SET p.num_defects = subquery.total_defects,
        p.type_1c = ?, 
        p.podon = ?, 
        p.plenka = ?, 
        p.plenka_nomer = ?, 
        p.plenka_partiya = ?,
        p.cubsStone = ?, 
        p.smena = ?,
        p.cupsPallete = ?  
    WHERE p.pallet_number = ?
      AND p.pallet_year = ?
      AND p.pallet_month = ?
      and id > 1000
  `;

  const queryParams = [
    pallet_number, pallet_year, pallet_month, type_1c,
    String(podon), String(plenka), String(plenka_nomer), String(plenka_partiya),
    cubsStone, smena, cupsPallete, pallet_number,
    pallet_year, pallet_month
  ];

  // Объект для вывода параметров
  const paramsObject = {
    type_1c,
    podon: String(podon),
    plenka: String(plenka),
    plenka_nomer: String(plenka_nomer),
    plenka_partiya: String(plenka_partiya),
    pallet_number,
    pallet_year,
    pallet_month,
    cubsStone,
    smena,
    cupsPallete,
  };

  // Выводим объект с параметрами в консоль
  console.log("Параметры для обновления:", paramsObject);

  // Выводим запрос с параметрами в консоль
  const queryWithParams = query.replace(/\?/g, () => queryParams.shift());
  console.log("Выполняемый запрос:", queryWithParams);

  return new Promise((resolve, reject) => {
    // Выполняем запрос
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.error('Ошибка при обновлении:', error);
        return reject(error);
      } else {
        console.log("Данные успешно обновлены:", queryWithParams);
        return resolve(results);
      }
    });
  });
};

// Экспортируем функцию обновления
module.exports = { updateData1c };
