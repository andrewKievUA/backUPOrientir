const axios = require('axios');
const snap7 = require('node-snap7');
const cron = require('node-cron');

// Создаем клиент для подключения к контроллеру
const s7client = new snap7.S7Client();

// Функция для получения и записи данных
async function fetchAndWriteCurrentI_L1() {
  try {
    // Шаг 1: Получаем данные I_L1 с PAC3220
    const url = 'http://192.168.10.90/data.json?type=INST_VALUES&_=1731584182951';
    const response = await axios.get(url);

    if (response.data && response.data.INST_VALUES && response.data.INST_VALUES.I_L1) {
      const currentI_L1 = response.data.INST_VALUES.I_L1.value;
      // console.log('Ток первой обмотки (I_L1):', currentI_L1, 'A');

      // Шаг 2: Подключаемся к контроллеру
      s7client.ConnectTo('192.168.10.145', 0, 2, function(err) {
        if (err) {
          console.log('Ошибка подключения к контроллеру:', s7client.ErrorText(err));
          return;
        }

        // console.log('Подключение к контроллеру успешно.');

        // Шаг 3: Подготавливаем буфер для записи тока в MD210
        const buffer = Buffer.alloc(4);
        buffer.writeFloatBE(currentI_L1, 0); // Записываем значение тока как 32-битное число с плавающей точкой (Big Endian)

        // Используем MBWrite для записи в MD210 (210-й байт области меток)
        s7client.MBWrite(210, 4, buffer, function(err) {
          if (err) {
            console.log('Ошибка записи данных в MD210:', s7client.ErrorText(err));
          } else {
            // console.log('Значение тока I_L1 успешно записано в MD210');
          }

          // Завершаем соединение с контроллером
          s7client.Disconnect();
        });
      });
    } else {
      console.log('Данные о токе I_L1 не найдены.');
    }
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
}

// Запускаем задачу, чтобы обновлять значение каждые 3 секунды
cron.schedule('*/3 * * * * *', () => {
  // console.log('Запуск обновления данных...');
  fetchAndWriteCurrentI_L1();
});

const http = require('http');
const PORT = 3071;
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
