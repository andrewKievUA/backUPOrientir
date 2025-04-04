import React, { useState, useEffect } from 'react';
import { words } from './words'; // Импортируем слова

const Reader = () => {
  const [currentWord, setCurrentWord] = useState(0);

  // Функция для воспроизведения речи
  const speakWord = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const handleNextWord = () => {
    setCurrentWord((prev) => (prev + 1) % words.length); // Переход к следующему слову
  };

  const handlePreviousWord = () => {
    setCurrentWord((prev) => (prev - 1 + words.length) % words.length); // Переход к предыдущему слову
  };

  const handleSpeakGerman = () => {
    speakWord(words[currentWord][0], "de-DE"); // Чтение на немецком
  };

  const handleSpeakRussian = () => {
    speakWord(words[currentWord][2], "ru-RU"); // Чтение на русском
  };

  // Обработка горячих клавиш
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handleSpeakGerman(); // При нажатии на стрелку влево читаем на немецком
      } else if (event.key === 'ArrowRight') {
        handleSpeakRussian(); // При нажатии на стрелку вправо читаем на русском
      } else if (event.key === 'ArrowDown') {
        handleNextWord(); // При нажатии на стрелку вниз переходим к следующему слову
      } else if (event.key === 'ArrowUp') {
        handlePreviousWord(); // При нажатии на стрелку вверх переходим к предыдущему слову
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentWord]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ margin: '20px', textAlign: 'center' }}>

        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{words[currentWord][0]}</p>
        <p style={{ fontSize: '18px', color: '#666' }}>{words[currentWord][1]}</p>
        <p style={{ fontSize: '20px', fontStyle: 'italic' }}>{words[currentWord][2]}</p>
        
        {/* Показываем картинку по URL */}
<img 
  src={words[currentWord]?.[3] || 'default-image-path.jpg'} 
  alt={words[currentWord]?.[0] || 'Default alt text'} 
  style={{ width: '300px', height: 'auto', marginTop: '20px' }}
/>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', margin: '20px' }}>
        <button onClick={handleSpeakGerman} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>DE</button>
        <button onClick={handleSpeakRussian} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>RU</button>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', margin: '20px' }}>
        <button onClick={handlePreviousWord} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>{"<="}</button>
        <button onClick={handleNextWord} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>{"=>"}</button>
      </div>
    </div>
  );
};

export default Reader;
