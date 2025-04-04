// telegaSlav/report.js
const axios = require('axios');

const formatMessage = (results) => {
    const counts = results.reduce((acc, row) => {
        const { type_1c, brak_persent_total } = row;

        if (!acc[type_1c]) {
            acc[type_1c] = { count: 0, total_brak: 0 };
        }

        acc[type_1c].count += 1;
        if (brak_persent_total !== null && brak_persent_total !== undefined) {
            acc[type_1c].total_brak += brak_persent_total;
        }

        return acc;
    }, {});

    const averageBrakArray = Object.keys(counts).map(type => {
        const { count, total_brak } = counts[type];
        const average = count > 0 ? parseFloat((total_brak / count).toFixed(2)) : 0;
        return { размер: type, average_brak_percent: average, total_count: count };
    });

    const totalCount = results.length;
    const totalBrak = results.reduce((sum, row) => sum + (row.brak_persent_total || 0), 0);
    const averageOverallBrak = totalCount > 0 ? parseFloat((totalBrak / totalCount).toFixed(2)) : 0;

    let message = `средний (${averageOverallBrak}%)\n`;
    averageBrakArray.forEach(item => {
        message += `${item.размер}(${item.total_count}шт)(${item.average_brak_percent.toFixed(2).replace('.', ',')}%)\n`;
    });

    return message.trim();
};

const sendReport = async (message) => {
    try {
        const response = await axios.post('http://192.168.10.254:3000/trigger-notification', {
            message: message.trim(),
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Отчет успешно отправлен:', response.data);
    } catch (error) {
        console.error('Ошибка при отправке отчета:', error.message);
    }
};

module.exports = { formatMessage, sendReport };
