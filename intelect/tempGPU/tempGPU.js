const express = require('express');
const si = require('systeminformation');

const app = express();
const port = 8081;

// Маршрут для получения температуры видеокарты
app.get('/gpu-temp', async (req, res) => {
  try {
    const data = await si.graphics();
    const gpuController = data.controllers.find(controller => controller.vendor === 'NVIDIA');
    
    if (gpuController && gpuController.temperatureGpu !== undefined) {
      res.json({ temperature: gpuController.temperatureGpu });
    } else {
      res.status(404).json({ message: 'Температура видеокарты не найдена' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении данных о температуре видеокарты', error });
  }
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
