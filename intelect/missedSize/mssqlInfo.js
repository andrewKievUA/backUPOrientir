async function mssqlInfo(Barcode, conn) {
  // Check if Barcode is missing
  if (!Barcode) {
    console.log("Barcode отсутствует, запрос не будет выполнен");
    return null; // Exit the function if Barcode is missing
  }

  const query = `
    SELECT *
    FROM [dbo].[Intelect]
    WHERE 
     PalleteNumber = ${Barcode}  
     ORDER BY ID DESC
  `;

  try {
    const result = await conn.request().query(query);
    return result.recordset[0];
  } catch (err) {
    console.error('Ошибка подключения или запроса к MSSQL:');
    throw err;
  } 
}

module.exports = mssqlInfo;
