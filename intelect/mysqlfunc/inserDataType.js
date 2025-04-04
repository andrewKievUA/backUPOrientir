const insertDataType = (num_stones, type, connection,pallet_number, side) => {
    // console.log("startes",data);
   
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяц +1, так как в JS месяцы начинаются с 0


    const query = `
    INSERT INTO p 
    (pallet_number, pallet_year, pallet_month, side, num_stones, type )
    VALUES (?, ?, ?, ?, ?, ?)`;




    connection.query(query, [values], (error, results) => {
        if (error) {
            console.error('Ошибка при вставке данных:', error);
            return;
        }
        // console.log('Данные успешно вставлены:', results.affectedRows);
    });
};

module.exports = insertDataType;