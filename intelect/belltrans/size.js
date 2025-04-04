const axios = require('axios');
const FormData = require('form-data');
// const insertDataType = require('./mysqlfunc/insertDataType.js');

async function size(buffer) {
    try {
        // Создаем объект FormData и добавляем буфер изображения
        const formData = new FormData();
        formData.append('file', buffer, { filename: 'image.jpg' });

        // Отправляем POST запрос с изображением (буфером)
        const result = await axios.post('http://192.168.10.44:8001/detect/', formData, {
            headers: {
                ...formData.getHeaders() // Устанавливаем заголовки для FormData    num_stones
            }
        });
        let most_common_heights = result.data.most_common_heights
        let averageHeight = Math.round(most_common_heights.reduce((sum, height) => sum + height, 0) / most_common_heights.length);
        const averageHeight_mult = Math.round(averageHeight * 1.7021)
        const num_defects = result.data.num_defects
        averageHeight= Math.round(averageHeight * 0.88)

         
        return {averageHeight, averageHeight_mult,num_defects}
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

module.exports = size;
