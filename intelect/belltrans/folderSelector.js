const fs = require('fs');
const path = require('path');

function folderSelector(photoNumber) {
    // Получаем текущие год и месяц
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Добавляем ведущий ноль, если месяц < 10

    // Базовая директория с использованием текущих года и месяца
    const baseDir = path.join('D:/photo', year.toString(), month);

    // Рассчитываем необходимую папку по номеру фото
    const folderNumber = Math.floor(photoNumber / 1000) * 1000;
    const saveDir = path.join(baseDir, folderNumber.toString());

    // Проверяем, существует ли папка, если нет - создаем
    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
    }

    // Выводим путь выбранной папки в консоль
    console.log('Selected folder:', saveDir);

    return saveDir;
}

module.exports = { folderSelector };
