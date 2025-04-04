const cron = require('node-cron');
const { getFilteredBarcodeHistory } = require('./correctSize/mssqlSelect.js');
const { getPalletData } = require('./correctSize/mysqlSelect.js');
const { updateType1cInMySQL } = require('./correctSize/updateMySQL.js');
const mysql = require('mysql');
const config = require('./config.json');

const mysqlPool = mysql.createConnection(config.database);

// Функция для выполнения проверки и обновления данных
function checkAndUpdateData() {
    console.log('Запуск проверки данных...');

    getFilteredBarcodeHistory(1000)
        .then(data => {
            if (data && data.length > 0) {
                const firstBarcode = data[0].pallet_number;
                const lastBarcode = data[data.length - 1].pallet_number;

                getPalletData(firstBarcode, lastBarcode, mysqlPool, (err, mysqlData) => {
                    if (err) {
                        console.error('Ошибка MySQL:', err);
                        return;
                    }

                    let discrepancies = compareArrays(mysqlData, data);
                    console.log('Найденные несоответствия:', discrepancies);

                    if (discrepancies.length > 0) {
                        updateType1cInMySQL(discrepancies, mysqlPool);
                    }
                });
            } else {
                console.log('Нет данных для отображения.');
            }
        })
        .catch(err => {
            console.error('Ошибка MSSQL:', err);
        });
}

// Запускаем задачу каждый час
cron.schedule('0 * * * *', () => {
    checkAndUpdateData();
});

// Функция для сравнения массивов
function compareArrays(mysqlArray, mssqlArray) {
    const discrepancies = [];

    mssqlArray.forEach(mssqlItem => {
        const mysqlItem = mysqlArray.find(item => item.pallet_number === mssqlItem.pallet_number);

        if (mysqlItem) {
            if (mysqlItem.type_1c !== mssqlItem.type_1c) {
                discrepancies.push({
                    pallet_number: mssqlItem.pallet_number,
                    mssql_type_1c: mssqlItem.type_1c,
                    mysql_type_1c: mysqlItem.type_1c
                });
            }
        } else {
            discrepancies.push({
                pallet_number: mssqlItem.pallet_number,
                mssql_type_1c: mssqlItem.type_1c,
                mysql_type_1c: null
            });
        }
    });

    return discrepancies;
}

// Запускаем первую проверку сразу после старта
checkAndUpdateData();
