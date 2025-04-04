import React from 'react';

const KeyHandler = ({ ar, questionNumber, activateLasers, speak, speakRus }) => {
  const handleKeyDown = (event) => {
    const keyCode = event.keyCode;
    const ansRU = ar[questionNumber].ansRU;
    const rus = ar[questionNumber].rus;
    const germ = ar[questionNumber].germ;

    if (keyCode === 37) {
      activateLasers(ansRU[0], rus);
    } else if (keyCode === 39 || keyCode === 39) {
      activateLasers(ansRU[1], rus);
    } else if (keyCode === 51) {
      activateLasers(ansRU[2], rus);
    } else if (keyCode === 52) {
      activateLasers(ansRU[3], rus);
    } else if (keyCode === 38 || keyCode === 81) {
      speak(germ);
      speakRus(rus);
    } else if (keyCode === 40) {
      speak(germ);
    }

    console.log(keyCode);
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ar, questionNumber, activateLasers, speak, speakRus]);

  return null;
};

export default KeyHandler;