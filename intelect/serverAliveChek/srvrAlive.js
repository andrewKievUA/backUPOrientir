const axios = require('axios');
const { exec } = require('child_process');
const path = require('path');


// Функция для проверки доступности сервера на локальном хосте
function checkServer() {
  axios.get('http://192.168.10.44:8000/health', { timeout: 9000 })
    .then(response => {
      if (response.status === 200) {
        console.log('Сервер работает');
      } else {
        console.log('Сервер вернул ошибку. Запускаем .bat файл...');
        runBatchFile();
      }
    })
    .catch(error => {
      console.log('Не удается подключиться к серверу. Запускаем .bat файл...', error.message);
      runBatchFile();
    });
}

// Функция для запуска .bat файла
function runBatchFile() {
  exec(path.join(__dirname, 'startMain.bat'), (err, stdout, stderr) => {
    if (err) {
      console.error(`Ошибка при запуске батника: ${err.message}`);
      return;
    }
    if (stderr) {
      console.error(`Ошибка в процессе выполнения батника: ${stderr}`);
      return;
    }
    console.log(`Результат выполнения батника: ${stdout}`);

    exec(`start "" "${path.join(__dirname, 'type.lnk')}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Ошибка при запуске ярлыка: ${err.message}`);
        return;
      }
      if (stderr) {
        console.error(`Ошибка в процессе выполнения ярлыка: ${stderr}`);
        return;
      }
      console.log(`Результат выполнения ярлыка: ${stdout}`);
    });
  });
}
checkServer()
// Запускаем проверку каждые 10 секунд
setInterval(checkServer, 40000);
