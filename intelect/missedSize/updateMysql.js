const updateData1c = require("../mysqlfunc/updateData1c.js");
const axios = require('axios');
const extractBarcodeData = require('./extractBarcodeData');



const sendRequest = (pallet, pallet_year, pallet_month) => {
  setTimeout(async () => {
          const response = await axios.get('http://localhost:3053/update-brak', {
              params: {
                  pallet,
                  pallet_year,
                  pallet_month
              }
          }) 
  }, 3000); // 3000 миллисекунд = 3 секунды
};


async function updateMysql(connection, r) {
  console.log("async function updateMysql", r);

  // Check if Barcode is missing
  if (!r.Barcode) {
    console.log("Barcode отсутствует в данных");
    return; // Exit the function if Barcode is missing
  }

  try {
    let b = extractBarcodeData(r.Barcode);
    const nom = r.Nomenclature.match(/\*(\d+)\*/)[1];
    console.log("размер кирпичей", nom);

    const cubicMetersStone = {
      100: 0.012,
      120: 0.0144,
      150: 0.018,
      200: 0.024,
      250: 0.03,
      280: 0.0336,
      300: 0.036,
      375: 0.045,
      400: 0.048,
      500: 0.06,
    };

    const cubicMeters = {
      100: 2.16,
      120: 2.16,
      150: 2.16,
      200: 2.16,
      250: 2.1,
      280: 2.016,
      300: 2.16,
      375: 1.8,
      400: 1.92,
      500: 1.8,
    };

    updateData1c(
      nom,
      r.podon,
      r.plenka,
      r.plenka_nomer,
      r.plenka_partiya,
      connection,
      b.lastSixDigits,
      b.year,
      b.month,
      cubicMetersStone[nom],
      r.smena,
      cubicMeters[nom]
    );
    sendRequest(r.podon,  b.year, b.month);// перепроверка процента брака



  } catch (error) {
    // console.error(error.message);
    console.log("ошибка обновления mysql");
    
  }
}

module.exports = updateMysql;
