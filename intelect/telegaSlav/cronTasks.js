// telegaSlav/cronTasks.js
const cron = require('node-cron');
const { executeQuery } = require('./database');
const { formatMessage, sendReport } = require('./report');

const executeQueryAndSendReport = async (isNightShift) => {
    const query = `
        SELECT type_1c, brak_persent_total
        FROM p 
        WHERE DATE(timestamp) = CURDATE() 
          AND ${
            isNightShift
              ? "((TIME(timestamp) BETWEEN '20:00:00' AND '23:59:59') OR (TIME(timestamp) BETWEEN '00:00:00' AND '08:00:00'))"
              : "TIME(timestamp) BETWEEN '08:00:00' AND '20:00:00'"
          }
          AND pallet_month = MONTH(CURDATE()) 
          AND side = 'B';
    `;

    executeQuery(query, async (error, results) => {
        if (error) {
            console.error("Ошибка при выполнении запроса:", error);
            return;
        }
        const message = formatMessage(results);
        console.log("Форматированное сообщение:", message);
        await sendReport(message);
    });
};

const scheduleCronTasks = () => {
    cron.schedule('30 8 * * *', () => {
        console.log('Выполняем дневной запрос с 08:00 до 20:00');
        executeQueryAndSendReport(false);
    });

    cron.schedule('30 20 * * *', () => {
        console.log('Выполняем ночной запрос с 20:00 до 08:00');
        executeQueryAndSendReport(true);
    });
};

module.exports = { scheduleCronTasks, executeQueryAndSendReport };
