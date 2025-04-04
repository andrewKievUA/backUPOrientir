// imageProcessor.js
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { determineDefectCounts } = require('./defectLogic'); // Импортируем логику дефектов
const insertDataDefect = require('./insertDataDefect.js'); 
const { folderSelector } = require('./folderSelector.js');
const Path = require('path');
const sharp = require('sharp');
const size = require('./size.js');

async function downloadImage(url, savePath, sideOfTheCamera, filename,connection) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });        
        let croppedImageBuffer = await cropImage(response.data, sideOfTheCamera, filename,connection)
        //    console.log(croppedImageBuffer,croppedImageBuffer);
        const type = await size(croppedImageBuffer, sideOfTheCamera, filename,connection)
        // console.log("type", type);
        
        fs.writeFileSync(savePath, croppedImageBuffer);
        return type
        // console.log('Image downloaded and saved to', savePath);
    } catch (error) {
        console.error('Error downloading the image:', error.message);
    }
}


async function cropImage(imageBuffer, sideOfTheCamera, filename,connection) {

    try {
        const metadata = await sharp(imageBuffer).metadata();  // Используем imageBuffer
        const { width, height } = metadata;

        // Настройки обрезки

        let top = 0;
        let right = 680;
        let left = 700;


        if (sideOfTheCamera === 2) {
            top = 0
            right = 940
            left = 410
        }

        const cropWidth = width - left - right;
        const cropHeight = height - top;

        const croppedImageBuffer = await sharp(imageBuffer)  // Используем imageBuffer
            .extract({ left: left, top: top, width: cropWidth, height: cropHeight })
            .toBuffer();

         
        // sendImageBuffer(croppedImageBuffer, sideOfTheCamera, filename)
        
        return croppedImageBuffer;
    } catch (error) {
        throw new Error(`Failed to crop image: ${error.message}`);
    }
}


async function sendImage(filePath, pallet_number, connection, side,typeOfStone,calc,massivePart) {

    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return;
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
        const response = await axios.post('http://localhost:8000/detect/', form, {
            headers: form.getHeaders(),
        });
        console.log('Detection Results:', response.data.num_defects);
        // console.log('Detection Results:', response.data.details);
        // Используем логику из внешнего файла для обработки результатов
        const defectCounts = determineDefectCounts(response.data.details);

        // Добавляем num_defects в объект defectCounts
        defectCounts.num_defects = response.data.num_defects;

        // Вставляем данные в базу данных
        await insertResults(defectCounts, pallet_number, connection, side,typeOfStone,calc,massivePart);

        // Сохраняем изображение, если оно возвращается с сервера
        if (response.data.image_base64 && defectCounts.num_defects > 0) {
            const imageBuffer = Buffer.from(response.data.image_base64, 'base64');

            const originalImagePath = Path.join(folderSelector(pallet_number), `${pallet_number}_${side}.jpg`);
             folderSelector
            fs.writeFileSync(originalImagePath, imageBuffer);
            // console.log('Image saved as detected_image.jpg');
        }
        //if (response.data.details.length > 0) {insertDataDefect(response.data.details, connection, pallet_number, side)}

    } catch (error) {
        if (error.response) {
            console.error('Error response from server:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
    } finally {
        // connection.end();
    }
}

// Функция для вставки результатов в базу данных
function insertResults(defectCounts, pallet_number, connection, side,typeOfStone,calc,massivePart) {

    console.log(defectCounts.num_defects,"calc",calc);
    let percentage = 0
    if (calc !== 0) {
        percentage = (defectCounts.num_defects / calc) * 100;
    } 
     
    // percentage= Math.floor(percentage); // Округление до целого числа
     console.log("percentage",percentage);
    
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO p (rassloenie, skol, vidbutosti_200, treshina, ugolok_treshina, vidbutosti, zaterto_valami, num_defects, pallet_number, pallet_year, pallet_month, side,num_stones,type,brak_persent,massivePart,type_1c)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)
        `;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяц +1, так как в JS месяцы начинаются с 0

        let a = 0
        let h = typeOfStone.averageHeight

        if (h > 80 && h <= 119) { a = 100; }
        if (h > 120 && h <= 139) { a = 120; }
        if (h > 140 && h <= 179) { a = 150; }
        if (h > 180 && h <= 229) { a = 200; }
        if (h > 230 && h <= 269) { a = 250; }
        if (h > 270 && h <= 289) { a = 280; }
        if (h > 290 && h <= 339) { a = 300; }
        if (h > 340 && h <= 389) { a = 375; }
        if (h > 390 && h <= 419) { a = 400; }
        if (h > 420 && h <= 550) { a = 500; }



        const values = [
            defectCounts.rassloenie || 0,
            defectCounts.skol || 0,
            defectCounts.vidbutosti_200 || 0,
            defectCounts.treshina || 0,
            defectCounts.ugolok_treshina || 0,
            defectCounts.vidbutosti || 0,
            defectCounts.zaterto_valami || 0,
            defectCounts.num_defects || 0,
            pallet_number || 0,
            year,
            month,
            side,
            typeOfStone.num_defects,
            a,
            percentage || 0,
            massivePart || 0,
            a
            
        ];


        connection.query(query, values, (err, results) => {
            if (err) {
                reject(new Error('Failed to insert data into database: ' + err.message));
            } else {
                // console.log('Data inserted successfully:', results);
                resolve(results);
            }
        });
    });
}

// Экспортируем функции для использования в основном приложении
module.exports = {
    downloadImage,
    sendImage
};
