import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import Study from "./homepage/Study";
import PhotoGallery from './homepage/PhotoGallery';
import PhotoModal from './homepage/PhotoModal';
import InfoComponentHeader from "./homepage/InfoComponentHeader";
import months from './data/months'; // Импортируйте массив
import hotKeys from './homepage/hotKeys.js'; // Импортируйте ваш обработчик клавиш

function HomePage() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [paletteNumber, setPaletteNumber] = useState('');
  const [photoUrls, setPhotoUrls] = useState({ A: '', B: '', C: '', D: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');

  // Установка текущего года и месяца при загрузке компонента
  useEffect(() => {
    const currentDate = new Date();
    setYear(currentDate.getFullYear().toString());
    setMonth((currentDate.getMonth() + 1).toString().padStart(2, '0')); // Месяц с ведущим нулем
  }, []);

  const fetchMaxPaletteNumber = async () => {
    try {
      const response = await axios.get('http://192.168.10.44:3069/getNumber');
      const number = response.data.number;
      setPaletteNumber(number);
    } catch (error) {
      console.error('Error fetching the number:', error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasParams = urlParams.has('palletYear') || urlParams.has('palletMonth') || urlParams.has('palletNumber');

    if (!hasParams) {
      fetchMaxPaletteNumber();
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const palletYear = urlParams.get('palletYear');
    const palletMonth = urlParams.get('palletMonth');
    const palletNumber = urlParams.get('palletNumber');

    if (palletYear) setYear(palletYear);
    if (palletMonth) setMonth(palletMonth);
    if (palletNumber) setPaletteNumber(palletNumber);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      hotKeys(e, setPaletteNumber, handleSendForStudy);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paletteNumber, year, month]);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!paletteNumber) return;

      try {
        let baseUrl = `http://192.168.10.44:3070/photo/${year}/${month}/${paletteNumber}/`;
        const urls = {
          A: baseUrl + `A`,
          B: baseUrl + `B`,
          C: baseUrl + `C`,
          D: baseUrl + `D`,
        };

        const responses = await Promise.all([
          axios.get(urls.B).then(() => ({ key: 'B', exists: true })).catch(() => ({ key: 'B', exists: false })),
          axios.get(urls.D).then(() => ({ key: 'D', exists: true })).catch(() => ({ key: 'D', exists: false })),
        ]);

        const bExists = responses.find(r => r.key === 'B').exists;
        const dExists = responses.find(r => r.key === 'D').exists;

        const photoUrls = {};

        if (!bExists) {
          try {
            await axios.get(urls.A);
            photoUrls.A = urls.A;
          } catch (err) {
            console.log("Фото A не найдено");
          }
        } else {
          photoUrls.B = urls.B;
        }

        if (!dExists) {
          try {
            await axios.get(urls.C);
            photoUrls.C = urls.C;
          } catch (err) {
            console.log("Фото C не найдено");
          }
        } else {
          photoUrls.D = urls.D;
        }

        setPhotoUrls(photoUrls);
      } catch (error) {
        console.error('Ошибка при загрузке фотографий:', error);
      }
    };

    fetchPhotos();
  }, [year, month, paletteNumber]);

  const handleSendForStudy = async (photoType, nullsa = 1) => {
    const url = `http://192.168.10.44:3069/study/${year}/${month}/${paletteNumber}/${photoType}/${nullsa}`;
    await Study(url);
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

  const navigateToPhoto = (type) => {
    const url = `http://192.168.10.44:3070/photo/${year}/${month}/${paletteNumber}/${type}`;
    window.open(url, '_blank');
  };

  const handleFirstPhotoClick = () => {
    setPaletteNumber((prevNumber) => (parseInt(prevNumber, 10) - 1).toString());
  };

  const handleSecondPhotoClick = () => {
    setPaletteNumber((prevNumber) => (parseInt(prevNumber, 10) + 1).toString());
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }} >
      <div className="text-center mb-0">
        {/* Ввод для выбора года */}
        Рік
        <Form.Control
          type="number"
          value={year}
          onChange={handleYearChange}
          style={{ display: 'inline-block', width: '100px', margin: '0 10px' }}
          placeholder="Рік"
        />

        {/* Выпадающий список для выбора месяца */}
        Місяць
        <Form.Select
          value={month}
          onChange={handleMonthChange}
          style={{ display: 'inline-block', width: '120px', margin: '0 10px' }}
        >
          {months.map(month => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </Form.Select>

        Номер палети
        <Form.Control
          type="number"
          value={paletteNumber}
          onChange={handlePaletteChange}
          style={{ display: 'inline-block', width: '100px', margin: '0 10px' }}
        />

        <Button
          variant="outline-dark"
          onClick={() => setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) - 1).toString())}
        >
          -1
        </Button>
        <Button
          variant="outline-dark"
          onClick={() => setPaletteNumber(prevNumber => (parseInt(prevNumber, 10) + 1).toString())}
        >
          +1
        </Button>
      </div>

      <InfoComponentHeader year={year} month={month} paletteNumber={paletteNumber} type="B" />
      <PhotoGallery photoUrls={photoUrls} 
  
      onFirstPhotoClick={handleFirstPhotoClick}
      onSecondPhotoClick={handleSecondPhotoClick} />
      <PhotoModal
        showModal={showModal}
        selectedPhoto={selectedPhoto}
        handleCloseModal={handleCloseModal}
      />

      {/* Кнопки для перехода к документам A и C */}
      <div className="text-center mt-4">
        <Button variant="outline-dark" onClick={() => navigateToPhoto('A')}>
          Перейти до оригінального Фото
        </Button>
        <Button variant="outline-dark" onClick={() => navigateToPhoto('C')}>
          Перейти до оригінального Фото
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
