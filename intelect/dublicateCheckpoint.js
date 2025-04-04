const mysql = require('mysql');
const cron = require('node-cron');
const config = require('./config.json'); // Импортируем конфигурацию

function removeDuplicates() {
  const connection = mysql.createConnection(config.database);

  connection.connect(err => {
    if (err) {
      console.error('Ошибка подключения к базе данных:', err);
      return;
    }
    console.log('Подключено к базе данных');

    const uniqueRecordsQuery = `
      SELECT MIN(id) as id
      FROM pallet_db.check
      GROUP BY numberTrackingPalete, checkPoint_Diff
    `;

    connection.query(uniqueRecordsQuery, (err, uniqueIds) => {
      if (err) {
        console.error('Ошибка при получении уникальных записей:', err);
        connection.end();
        return;
      }

      const idsToKeep = uniqueIds.map(record => record.id);

      if (idsToKeep.length === 0) {
        console.log('Нет дубликатов для удаления');
        connection.end();
        return;
      }

      const deleteQuery = `
        DELETE FROM pallet_db.check
        WHERE id NOT IN (?)
      `;

      connection.query(deleteQuery, [idsToKeep], (err, result) => {
        if (err) {
          console.error('Ошибка при удалении дубликатов:', err);
        } else {
          console.log(`Удалено дубликатов: ${result.affectedRows}`);
        }
        connection.end();
      });
    });
  });
}

// Запускаем cron-задачу каждые 10 минут
cron.schedule('*/10 * * * *', () => {
  console.log('Запуск удаления дубликатов...');
  removeDuplicates();
});

console.log('Cron-задача запущена. Удаление дубликатов каждые 10 минут.');
