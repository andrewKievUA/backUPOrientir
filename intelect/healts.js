const axios = require('axios');
const snap7 = require('node-snap7');
const cron = require('node-cron');

// Конфигурация подключения к PLC
const hardware = {
  name: "transporter",
  host: "192.168.10.216",
  port: 102,
  rack: 0,
  slot: 2,
};

// Инициализация клиента S7
const client = new snap7.S7Client();

// Серверы для проверки
const servers = [
  { name: 'AiDetect', url: 'http://192.168.10.44:8000/health' },
  { name: 'TransporterLogic', url: 'http://192.168.10.44:3069/health' },
  { name: 'PhotoServer', url: 'http://192.168.10.44:3070/health' },
  { name: 'TokMelnits', url: 'http://192.168.10.44:3071/health' },
  { name: 'DefectPercentTelegram', url: 'http://192.168.10.44:3073/health' },
  { name: 'TransporterBlockOperator', url: 'http://192.168.10.44:3074/health' },
  { name: 'Laptop', url: 'http://192.168.10.47:3070/health' },
];

// Подключение к PLC
async function connectToPLC() {
  return new Promise((resolve, reject) => {
    client.ConnectTo(hardware.host, hardware.rack, hardware.slot, (err) => {
      if (err) {
        reject(new Error(`Failed to connect to PLC: ${client.ErrorText(err)}`));
      } else {
        resolve("Connected to PLC successfully");
      }
    });
  });
}

// Запись байта в MB660
async function writeToMB660(byteValue) {
  return new Promise((resolve, reject) => {
    client.MBWrite(660, 1, Buffer.from([byteValue]), (err) => {
      if (err) {
        reject(new Error(`Failed to write to MB660: ${client.ErrorText(err)}`));
      } else {
        resolve("Byte written to MB660 successfully");
      }
    });
  });
}

// Проверка состояния серверов и запись состояния
async function checkServersAndWriteToPLC() {
  try {
    console.log("Connecting to PLC...");
    await connectToPLC();
    console.log("Connected to PLC");

    const byteState = { value: 0 };

    await Promise.all(
      servers.map(async (server, index) => {
        try {
          const response = await axios.get(server.url, {
            headers: { 'X-Server-Name': server.name },
            timeout: 10000, // Тайм-аут 10 секунд
          });

          if (response.status < 200 || response.status >= 300) {
            console.log(`Server issue: ${server.name}`);
            byteState.value |= (1 << index);
          }
        } catch (error) {
          console.log(`Server error: ${server.name} (${error.message})`);
          byteState.value |= (1 << index); // Устанавливаем бит
        }
      })
    );

    console.log(`Writing byte to MB660: ${byteState.value.toString(2).padStart(8, '0')}`);
    await writeToMB660(byteState.value);
    console.log("State written to MB660");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    client.Disconnect();
    console.log("Disconnected from PLC");
  }
}

// Настройка крон-задачи
cron.schedule('* * * * *', () => {
  console.log(`[${new Date().toISOString()}] Running health check and PLC write task`);
  checkServersAndWriteToPLC();
});
