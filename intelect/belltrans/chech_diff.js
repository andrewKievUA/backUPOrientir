const { adjustDate } = require('./adjustDate');

const chech_diff = (client,connection, checkPoint_Diff, numberTrackingPalete, printerNumber,diffNumber) => {

    let date = adjustDate(printerNumber)
    console.log(date);
    
    console.log("started", checkPoint_Diff);
    const q = `
        INSERT INTO pallet_db.check 
        (checkPoint_Diff, numberTrackingPalete, printerNumber, day, month, year) 
        VALUES ('${diffNumber}', '${numberTrackingPalete}', '${printerNumber}', '${date.day}', '${date.month}', '${date.year}')
    `;

    connection.query(q, (error, results) => {
        if (error) {
            console.error('Ошибка при вставке данных:', error);
            return;
        }
        console.log('Данные успешно вставлены:diffNumber' );
    });

    const buffer = Buffer.alloc(2); // Создаем буфер размером 2 байт
    // buffer.writeUInt8(1, 0); // Записываем логическую единицу в первый байт
    client.DBWrite(622, 124, 2, buffer, (err) => { // Пишем значение в DB622.DBW124   
        if (err) {
            console.error('Ошибка записи:', err); // DBWrite(dbNumber: number, start: number, size: number, buffer: Buffer, callback?: (err: any) => void): boolean;
        } else {
            console.log('Сигнал отправлен на микроконтроллер');
        }
        // client.Disconnect();
    });
};

module.exports = { chech_diff };
