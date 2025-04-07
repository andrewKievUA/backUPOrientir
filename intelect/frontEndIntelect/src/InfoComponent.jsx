import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InfoComponent = ({ year, month, paletteNumber, type }) => {


  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!paletteNumber) {
        console.error("Palette number is missing");
        setLoading(false);
        return; // Выход из функции, если paletteNumber пустой
      }
      try {

        console.log("paletteNumber", paletteNumber, type);
        let url = `http://192.168.10.44:3069/info/${year}/${month}/${paletteNumber}/${type}`;
        console.log(url);
        console.log("Year:", year, "Month:", month, "Palette Number:", paletteNumber, "Type:", type);

        const response = await axios.get(url);
        console.log(response.data);

        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, paletteNumber, type]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    console.log(date);

    // Получаем день недели, число и месяц
    const dayOfWeek = date.toLocaleDateString('uk-UA', { weekday: 'long' }); // Получаем день недели на украинском
    const day = date.getDate(); // Получаем число
    const month = date.toLocaleDateString('uk-UA', { month: 'long' }); // Получаем месяц на украинском

    return `${dayOfWeek}, ${day} ${month}`; // Возвращаем день недели, число и месяц
};

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div>
      {data && data.length > 0 ? (
        data

          .map((item, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              {item.timestamp && <span> {formatTime(item.timestamp)}</span>}
              {item.rassloenie > 0 && <span> ({item.rassloenie})</span>}
              {item.type > 0 && <span> тип ({item.type})</span>}
              {item.num_stones > 0 && <span> камней({item.num_stones})</span>}
              {item.num_stones > 0 && <span> брак процент({item.brak_persent.toFixed(1)})</span>}
              {item.num_stones > 0 && <span> брак общ({item.brak_persent_total.toFixed(1)})</span>}
            </div>
          ))
      ) : (
        <p>Нет данных для отображения</p>
      )}
    </div>
  );
};

export default InfoComponent;
