// mssqlConnection.js
const sql = require("mssql");
const configHost = require("./config"); // Предполагается, что у вас есть файл конфигурации

async function getLatestBarcodeHistory() {
  const query = `
    SELECT *
    FROM [dbo].[Intelect]
    WHERE DT = (SELECT MAX(DT) FROM [dbo].[Intelect]);
  `;

  let conn; // Объявляем переменную для подключения
  try {
    conn = await sql.connect(configHost.ms);
    const result = await conn.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error('Ошибка подключения или запроса к MSSQL:', err);
    throw err;
  } finally {
    // Закрываем подключение в блоке finally
    if (conn) {
      await conn.close();
    }
  }
}

module.exports = {
  getLatestBarcodeHistory
};
