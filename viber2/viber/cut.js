const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'C:/rezka-params/viber_bot/reolink'; // Папка с исходными изображениями
const outputDir = 'C:/rezka-params/viber_bot/'; // Папка для сохранения итогового изображения

// Создайте выходную папку, если ее нет
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Получите список всех .jpg файлов в папке
fs.readdir(inputDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.jpg') {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, file);

            sharp(inputPath)
                .metadata()
                .then(({ width, height }) => {
                    // Настройки обрезки
                    const left = 250;
                    const right = 250 + 70;
                    const top = 100 + 30;
                    const cropWidth = width - left - right;
                    const cropHeight = height - top;

                    sharp(inputPath)
                        .extract({ left: left, top: top, width: cropWidth, height: cropHeight })
                        .toFile(outputPath, (err, info) => {
                            if (err) throw err;
                            console.log(`Processed ${file}:`, info);
                        });
                })
                .catch(err => {
                    console.error(`Failed to process ${file}:`, err);
                });
        }
    });
});
