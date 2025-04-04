function adjustDate(printerNumber,photoNumber) {
    const now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1; // Месяцы в JavaScript считаются с 0
    let year = now.getFullYear();

    // Проверка, если число 1 и printerNumber более 10000, то откатываемся на день назад
    if (day === 1 && printerNumber > 10000) {
        // Переходим на последний день предыдущего месяца
        const previousMonth = new Date(year, month - 1, 0);
        day = previousMonth.getDate(); // Последний день предыдущего месяца
        console.log("inside",day, month, year)
        if (month === 1) {
            // Если текущий месяц - январь, переходим на декабрь прошлого года
            month = 12;
            year -= 1;
        } else {
            // Откатываемся на предыдущий месяц
            month -= 1;
        }
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Добавляем ведущий ноль, если месяц < 10
    }

    console.log("outside",day, month, year)

    return { day, month, year };
}

module.exports = { adjustDate };
