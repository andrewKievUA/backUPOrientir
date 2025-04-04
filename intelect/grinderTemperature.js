const snap7 = require('node-snap7');
const client = new snap7.S7Client();

const sourceIP = '192.168.10.145';
const sourceDB = 201;
const startOffset = 2;
const endOffset = 38;
const dataSize = endOffset - startOffset + 4; // 38 байт

const labels = [
  'Главный редуктор °C',
  'Подшипник привода °C',
  'Подшипник без привода °C',
  'Обмотка 1 °C',
  'Обмотка 2 °C',
  'Обмотка 3 °C',
  'Фиксированный подшипник °C',
  'Плавающий подшипник °C',
  'Мощность кВт',
  'Ток А'
];

function readData() {
  client.ConnectTo(sourceIP, 0, 2, (err) => {
    if (err) return console.error(`Ошибка подключения: ${client.ErrorText(err)}`);

    client.DBRead(sourceDB, startOffset, dataSize, (err, res) => {
      client.Disconnect();
      if (err) return console.error(`Ошибка чтения данных: ${client.ErrorText(err)}`);

      console.log('📊 Данные с контроллера:');
      for (let i = 0; i < labels.length; i++) {
        const value = res.readFloatBE(i * 4).toFixed(2);
        console.log(`${labels[i]}: ${value}`);
      }
    });
  });
}

readData();
