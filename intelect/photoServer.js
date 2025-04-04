const os = require('os');
const express = require('express');
const Path = require('path');
const path = Path
const app = express();
const port = 3070;
const cors = require('cors'); // Импортируем модуль cors
app.use(cors());
app.use(express.json());

const basePhotoPath = 'D:/photo';

function getCalculatedFolder(paletteNumber) {
    let calculatedFolder = Math.floor((parseInt(paletteNumber, 10) / 1000)) * 1000;
    return String(calculatedFolder);
}

app.get('/photo/:year/:month/:paletteNumber/:type', (req, res) => {
    const { year, month, paletteNumber, type } = req.params;

    function formatMonth(month) {
        return month.toString().padStart(2, '0'); // Более элегантный способ
    }

    const photoPath = path.join(basePhotoPath, year, formatMonth(month), getCalculatedFolder(paletteNumber), `${paletteNumber}_${type}.jpg`);

    res.set({ 'Content-Length': 470 });
        res.sendFile(photoPath, (err) => {
            if (err && !res.headersSent) {
                console.error(`Ошибка при отправке файла: ${err}`);
                res.status(404).send('Файл не найден');
            }
        });
 
});



app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});



app.get('/memory-usage', (req, res) => {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercentage = ((usedMemory / totalMemory) * 100).toFixed(2); // округляем до двух знаков после запятой

    res.json({
        memoryUsagePercentage: memoryUsagePercentage + '%'
    });
});





app.listen(port,'0.0.0.0', () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});





