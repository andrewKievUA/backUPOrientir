const insertDataDefect = (data, connection,pallet_number, side) => {
    // console.log("startes",data);
    

    const parsedResults = data.map(result => {
        const lines = result.split('\n').map(line => line.trim());
        // Парсинг первой строки
        const objectData = lines[0].match(/Object: (\d+), Confidence: ([\d.]+), X1: ([\d.]+), Y1: ([\d.]+), X2: ([\d.]+), Y2: ([\d.]+)/);
        const object = {
            object: parseInt(objectData[1], 10),
            confidence: parseFloat(objectData[2]),
            x1: parseFloat(objectData[3]),
            y1: parseFloat(objectData[4]),
            x2: parseFloat(objectData[5]),
            y2: parseFloat(objectData[6]),
        };
        // console.log("objectics", object);

        return object;
    });

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяц +1, так как в JS месяцы начинаются с 0

    const query = `INSERT INTO pallet_db.defects (type, conf, x1, y1, x2, y2, id, side, year , month ) VALUES ?`;
    const values = parsedResults.map(item => [item.object, item.confidence, item.x1, item.y1, item.x2, item.y2,pallet_number,side, year , month]);

    connection.query(query, [values], (error, results) => {
        if (error) {
            console.error('Ошибка при вставке данных:', error);
            return;
        }
        // console.log('Данные успешно вставлены:', results.affectedRows);
    });
};

module.exports = insertDataDefect;