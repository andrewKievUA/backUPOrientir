const sql = require('mssql');
const snap7 = require('node-snap7');

const dbConfig = {
  user: 'asu_accounting',
  password: 'asu123accounting',
  server: '10.10.10.2',
  database: 'BarCodeScan',
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
};

const client = new snap7.S7Client();
const PLC_IP = '192.168.10.216';
const DB_NUMBER = 642;
const START_OFFSET = 26;
const BUFFER_LENGTH = 10;

let pool;

// Функция подключения к базе данных
async function connectToDatabase() {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
    setTimeout(connectToDatabase, 3000); // Повторная попытка через 3 секунды
  }
}

// Функция подключения к контроллеру
function connectToPLC() {
  client.ConnectTo(PLC_IP, 0, 2, (err) => {
    if (err) {
      console.error('Ошибка подключения к контроллеру:', client.ErrorText(err));
      setTimeout(connectToPLC, 3000); // Повторная попытка через 3 секунды
    } else {
      console.log('Connected to the PLC.');
    }
  });
}

// Основная функция для работы
async function fetchDataAndWriteToPLC() {
  if (!pool || !pool.connected) {
    console.log('Database connection is not available. Retrying...');
    return;
  }

  if (!client.Connected()) {
    console.log('PLC connection is not available. Retrying...');
    return;
  }

  try {
    // Получаем данные из базы данных
    const result = await pool.request().query('SELECT * FROM dbo.StoreStopTransport WHERE checking = 1');
    if (result.recordset.length === 0) {
      console.log('No data found with checking = 1.');
      return;
    }

    const row = result.recordset[0];
    const buffer = Buffer.alloc(BUFFER_LENGTH);

    if (row.krane_1 + row.krane_2 + row.krane_3+ row.krane_4 + row.krane_5 === 0) {
        // console.log('No Aktion');
        return;
      }

    console.log(' Aktion', row.krane_1, row.krane_2 ,row.krane_3 , row.krane_4,row.krane_5);
    buffer.writeInt16BE(row.krane_1 || 0, 0);
    buffer.writeInt16BE(row.krane_2 || 0, 2);
    buffer.writeInt16BE(row.krane_3 || 0, 4);
    buffer.writeInt16BE(row.krane_4 || 0, 6);
    buffer.writeInt16BE(row.krane_5 || 0, 8);

    // Пишем данные в контроллер
    client.DBWrite(DB_NUMBER, START_OFFSET, buffer.length, buffer, async (err) => {
      if (err) {
        console.error('Ошибка записи в контроллер:', client.ErrorText(err));
      } else {
        console.log('Данные успешно записаны в контроллер.');

        // Обновляем данные в базе данных
        try {
          const updateQuery = `
            UPDATE BarCodeScan.dbo.StoreStopTransport 
            SET krane_1 = 0, krane_2 = 0, krane_3 = 0, krane_4 = 0, krane_5 = 0 
            WHERE ID = ${row.ID};
          `;
          await pool.request().query(updateQuery);
          console.log('Данные в базе данных успешно обновлены.');
        } catch (updateErr) {
          console.error('Ошибка обновления данных в базе данных:', updateErr.message);
        }
      }
    });
  } catch (err) {
    console.error('Ошибка при работе с данными:', err.message);
  }
}

// Циклическое выполнение задачи
function startProcessing() {
  setInterval(fetchDataAndWriteToPLC, 5000);
}

// Основной поток выполнения
(async function main() {
  await connectToDatabase(); // Подключаемся к базе данных
  connectToPLC(); // Подключаемся к контроллеру
  startProcessing(); // Запускаем циклическую обработку
})();



const http = require('http');
const PORT = 3074;
const requestHandler = (req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};
const server = http.createServer(requestHandler);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});