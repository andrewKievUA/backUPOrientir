const { getLatestBarcodeHistory } = require("./mssqlConnection.js");
const  updateData1c  = require("../mysqlfunc/updateData1c.js");
const axios = require('axios');

async function mainUpdatePlenkaSize(connection) {
  try {
    const recordset = await getLatestBarcodeHistory();

    if (recordset.length > 0) {
      try {
        const barcodeData = extractBarcodeData(recordset[0].Barcode);

        // Получение параметров для обновления
        const pallet_number = barcodeData.lastSixDigits; // Используйте последние 6 цифр
        const pallet_year = barcodeData.year;
        const pallet_month = barcodeData.month;

        const r = recordset[0];
        const nom = r.Nomenclature.match(/\*(\d+)\*/)[1];
        console.log("размер кирпичей",nom);

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

        // Замените следующие переменные на свои
        const type_1c = nom;
        const podon = r.podon;
        const plenka = r.plenka;
        const plenka_nomer = r.plenka_nomer;
        const plenka_partiya = r.plenka_partiya;
        const cubsStone = cubicMetersStone[nom];
        const smena = r.smena;
        const cupsPallete = cubicMeters[nom];

        updateData1c(
          nom,
          podon,
          plenka,
          plenka_nomer,
          plenka_partiya,
          connection ,
          pallet_number,
          pallet_year,
          pallet_month,
          cubicMetersStone[nom],
          smena,
          cubicMeters[nom]

          
      );
      sendRequest()

      } catch (error) {
       
        console.error(error.message);
      }

      // console.log(recordset[0]);
    } else {
      console.log('Нет данных.');
    }
  } catch (err) {
    console.error('Ошибка получения данных:', err);
  }
}



const sendRequest = (pallet, pallet_year, pallet_month) => {
  setTimeout(async () => {
    await axios.get('http://localhost:3053/update-brak', {
      params: {
        pallet,
        pallet_year,
        pallet_month,
      },
    });
  }, 3000); // 3000 миллисекунд = 3 секунды
};

function extractBarcodeData(barcode) {
  if (!barcode || barcode.length < 6) {
    throw new Error('Неверный формат баркода');
  }

  const year = `20${barcode.substring(0, 2)}`;
  const month = barcode.substring(2, 4);
  const day = barcode.substring(4, 6);
  const lastSixDigits = barcode.slice(-6).replace(/^0+/, '');

  return {
    year,
    month,
    day,
    lastSixDigits,
  };
}

module.exports = { mainUpdatePlenkaSize };
