const keyHandlers = (e, setPaletteNumber, handleSendForStudy) => {
    // Приведем нажатую клавишу к нижнему регистру для унификации
    const key = e.key.toLowerCase(); 
  
    switch (key) {
      case 'arrowright':
        setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) + 1).toString());
        break;
      case 'arrowleft':
        setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) - 1).toString());
        break;
      case 'a': // Английская 'a'
      case 'ф': // Русская 'ф'
        setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) - 1).toString());
        break;
      case 'd': // Английская 'd'
      case 'в': // Русская 'в'
        setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) + 1).toString());
        break;
      case 'w': // Английская 'w'
      case 'ц': // Русская 'ц'
        handleSendForStudy('A');
        break;
      case 's': // Английская 's'
      case 'ы': // Русская 'ы'
      case 'і': // Русская 'ы'
        handleSendForStudy('C');
        break;
      default:
        break;
    }
  };
  
  export default keyHandlers;
  