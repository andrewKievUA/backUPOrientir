import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const AnalPercent = () => {
  const [brakPercentage, setBrakPercentage] = useState(null);
  const [error, setError] = useState(null);

  const fetchBrakPercentage = async () => {
    const palletNumberFrom = 29000; // Задайте ваши значения
    const palletNumberTo = 29400;
    const palletYear = 2024;
    const palletMonth = 10;
    const side = 'B';

    try {
      const response = await axios.get('http://192.168.10.44:3010/analytics-percent', {
        params: {
          pallet_number_from: palletNumberFrom,
          pallet_number_to: palletNumberTo,
          pallet_year: palletYear,
          pallet_month: palletMonth,
          side: side,
        },
      });

      // Предполагаем, что сервер возвращает объект с процентом брака
      setBrakPercentage(response.data.brak_percentage);
      setError(null); // Сбросить ошибку
    } catch (err) {
      setError('Ошибка при получении данных');
      console.error('Ошибка:', err);
    }
  };

  return (
    <div>
      <h1>Аналитика Брака</h1>
      <Button variant="primary" onClick={fetchBrakPercentage}>
        Получить процент брака
      </Button>
      {brakPercentage !== null && (
        <div>
          <h2>Процент брака: {brakPercentage}%</h2>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AnalPercent;
