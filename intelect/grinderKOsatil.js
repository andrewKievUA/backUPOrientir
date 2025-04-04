const snap7 = require('node-snap7');
const client = new snap7.S7Client();
const cron = require('node-cron');

const sourceIP = '192.168.10.145';
const sourceDB = 201;
const dataSize = 42;
const targetIP = '192.168.10.10';

function transferData() {
  // Чтение данных из источника
  client.ConnectTo(sourceIP, 0, 2, (err) => {
    if (err) return console.error(`Ошибка подключения к источнику: ${client.ErrorText(err)}`);

    const data = Buffer.alloc(dataSize);
    client.DBRead(sourceDB, 0, dataSize, (err, res) => {
      client.Disconnect();
      if (err) return console.error(`Ошибка чтения данных: ${client.ErrorText(err)}`);

      // Запись данных в целевой контроллер
      client.ConnectTo(targetIP, 0, 2, (err) => {
        if (err) return console.error(`Ошибка подключения к целевому контроллеру: ${client.ErrorText(err)}`);

        client.DBWrite(19, 0, res.length, res, (err) => {
          client.Disconnect();
          if (err) return console.error(`Ошибка записи: ${client.ErrorText(err)}`);
          console.log('Данные успешно переданы');
        });
      });
    });
  });
}


cron.schedule('*/2 * * * * *', () => {
    transferData();
  });



 




