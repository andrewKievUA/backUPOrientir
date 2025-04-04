const updateData1c = async (type_1c, podon, plenka, plenka_nomer, plenka_partiya, pool, pallet_number, pallet_year, pallet_month, cubsStone, smena, cupsPallete) => {
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
  `;

  const queryParams = [
    pallet_number, pallet_year, pallet_month, type_1c,
    podon, plenka, plenka_nomer, plenka_partiya,
    cubsStone, smena, cupsPallete, pallet_number,
    pallet_year, pallet_month
  ];


  const paramsObject = {
    type_1c,
    podon,
    plenka,
    plenka_nomer,
    plenka_partiya,
    pallet_number,
    pallet_year,
    pallet_month,
    cubsStone,
    smena,
    cupsPallete,
  };

  // Выводим объект с параметрами в консоль
  // console.log("Параметры для обновления:", paramsObject);

  // const queryWithParams = query.replace(/\?/g, () => queryParams.shift());
  // console.log("Выполняемый запрос:", queryWithParams);

  
  console.log("Обновление 1с:", pallet_number);



  return new Promise((resolve, reject) => {
      pool.query(query, [pallet_number, pallet_year, pallet_month, type_1c, podon, plenka, plenka_nomer, plenka_partiya, cubsStone, smena, cupsPallete, pallet_number, pallet_year, pallet_month], (error, results) => {
          if (error) {
              console.error('Ошибка при обновлении updateData1c:');
              reject(error);
          } else {
            // console.log("Выполняемый запрос:", queryWithParams);
              console.log('Данные успешно обновлены:  updateData1c ');
              resolve(results);
          }
      });
  });
};

// Экспорт функции
module.exports = updateData1c;
