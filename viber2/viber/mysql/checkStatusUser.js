

async function  checkStatusUser(data, connection, callback) {
    console.log("new user started123");
    const query = `SELECT * FROM stat.viber_user WHERE id_viber = "${data}"`;

    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error checkStatusUser data: ', error);
            callback(error, null); // Передаем ошибку в колбэк
            return;
        }

        if (results.length === 0) {
            // Если нет результатов, передаем 0 в колбэк
            callback(null, { status: 9 });
            return;
        }

        const cleanResults = results.map(row => ({ ...row }));
        const userResult = cleanResults[0];
        // Передаем все поля из базы данных в колбэк
        callback(null, userResult);
    });
}
module.exports = checkStatusUser;
