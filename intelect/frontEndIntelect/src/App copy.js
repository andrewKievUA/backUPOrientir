import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import Study from "./Study";
import PhotoGallery from './PhotoGallery';
import PhotoModal from './PhotoModal';
import InfoComponentHeader from "./InfoComponentHeader";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AnalyticsPage from './AnalyticsPage'; // Импорт страницы

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Другие маршруты */}
//         <Route path="/analytics" element={<AnalyticsPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


function App() {
  const [year, setYear] = useState('0');
  const [month, setMonth] = useState('0');
  const [paletteNumber, setPaletteNumber] = useState('');
  const [photoUrls, setPhotoUrls] = useState({ A: '', B: '', C: '', D: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');

  const fetchMaxPaletteNumber = async () => {
    try {
      const response = await axios.get('http://192.168.10.44:3069/getNumber');
      const number = response.data.number;
      setPaletteNumber(number); // Обновляем палету на крайний номер
    } catch (error) {
      console.error('Error fetching the number:', error);
    }
  };

  useEffect(() => {
    // fetchMaxPaletteNumber();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) + 1).toString());
      } else if (e.key === 'ArrowLeft') {
        setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) - 1).toString());
      } else if (e.key === 'a') {
        setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) - 1).toString());
      } else if (e.key === 'd') {
        setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) + 1).toString());
      } else if (e.key === 'w') {
        handleSendForStudy('A');
      } else if (e.key === 's') {
        handleSendForStudy('C');
      }
    };

    

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paletteNumber, year, month]);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!paletteNumber) return; // Не делать запрос, если палета не установлена

      try {
        let baseUrl = `http://192.168.10.44:3070/photo/${year}/${month}/${paletteNumber}/`;
        const urls = {
          A: baseUrl + `A`,
          B: baseUrl + `B`,
          C: baseUrl + `C`,
          D: baseUrl + `D`,
        };

        // Сначала проверяем наличие файлов B и D
        const responses = await Promise.all([
          axios.get(urls.B).then(() => ({ key: 'B', exists: true })).catch(() => ({ key: 'B', exists: false })),
          axios.get(urls.D).then(() => ({ key: 'D', exists: true })).catch(() => ({ key: 'D', exists: false })),
        ]);

        const bExists = responses.find(r => r.key === 'B').exists;
        const dExists = responses.find(r => r.key === 'D').exists;

        const photoUrls = {};

        // Если файл B не существует, проверяем и добавляем A
        if (!bExists) {
          try {
            await axios.get(urls.A);
            photoUrls.A = urls.A;
          } catch (err) {
            console.log("Фото A не найдено");
          }
        } else {
          photoUrls.B = urls.B; // Если B существует, добавляем его
        }

        // Если файл D не существует, проверяем и добавляем C
        if (!dExists) {
          try {
            await axios.get(urls.C);
            photoUrls.C = urls.C;
          } catch (err) {
            console.log("Фото C не найдено");
          }
        } else {
          photoUrls.D = urls.D; // Если D существует, добавляем его
        }

        setPhotoUrls(photoUrls);
      } catch (error) {
        console.error('Ошибка при загрузке фотографий:', error);
      }
    };

    fetchPhotos();
  }, [year, month, paletteNumber]);


  const handlePhotoClick = (url) => {
    setSelectedPhoto(url);
    setShowModal(true);
  };

  const handleSendForStudy = async (photoType, nullsa = 1) => {
    const url = `http://192.168.10.44:3069/study/${year}/${month}/${paletteNumber}/${photoType}/${nullsa}`;
    await Study(url); // Вызов функции Study для отправки запроса
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePaletteChange = (e) => {
    setPaletteNumber(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }} >


      {/* <VideoButton/> */}

      <div className="text-center mb-4">
        {/* Ввод для выбора года */}
        Год
        <Form.Control
          type="number"
          value={year}
          onChange={handleYearChange}
          style={{ display: 'inline-block', width: '100px', margin: '0 10px' }}
          placeholder="Год"
        />

        {/* Ввод для выбора месяца */}
        месяц
        <Form.Control
          type="number"
          value={month}
          onChange={handleMonthChange}
          style={{ display: 'inline-block', width: '100px', margin: '0 10px' }}
          placeholder="Месяц"
        />

        <Button
          variant="outline-secondary"
          onClick={() => setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) - 1).toString())}
        >
          -1
        </Button>
        Номер 
        <Form.Control
          type="number"
          value={paletteNumber}
          onChange={handlePaletteChange}
          style={{ display: 'inline-block', width: '100px', margin: '0 10px' }}
        />

        <Button
          variant="outline-secondary"
          onClick={() => setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) + 1).toString())}
        >
          +1
        </Button>

        {/* <Button
          variant="outline-secondary"
          onClick={fetchMaxPaletteNumber} // При нажатии получаем номер крайней палеты
          className="ml-2"
        >
          Крайняя палета
        </Button> */}
      </div>
      <InfoComponentHeader year={year} month={month} paletteNumber={paletteNumber} type="B" />
      <PhotoGallery photoUrls={photoUrls} handlePhotoClick={handlePhotoClick} />
      <PhotoModal
        showModal={showModal}
        selectedPhoto={selectedPhoto}
        handleCloseModal={handleCloseModal}
      />
          <Router>
       <Routes>
         {/* Другие маршруты */}
         <Route path="/analytics" element={<AnalyticsPage />} />
       </Routes>
     </Router>


    </div>
  );
}

export default App;
