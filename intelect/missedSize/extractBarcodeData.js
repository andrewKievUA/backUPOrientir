// extractBarcodeData.js

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
  
  module.exports = extractBarcodeData; // Экспортируем функцию
  