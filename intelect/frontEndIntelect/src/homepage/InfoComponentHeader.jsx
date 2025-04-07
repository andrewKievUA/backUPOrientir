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

    const day = date.getDate(); // Получаем число
    const dayOfWeek = date.toLocaleDateString('uk-UA', { weekday: 'short' }); // Получаем день недели на украинском
    const month = date.toLocaleDateString('uk-UA', { month: 'short' }); // Получаем месяц на украинском
    
    // Получаем время
    const time = date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Получаем время на украинском

    return `, ${day}  ${month} (${dayOfWeek}) ${time} , `; // Возвращаем день недели, число, месяц и время
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
              {item.brak_persent_total > 0 && <span> Брак ({Number(item.brak_persent_total.toFixed(1))}%)</span>}
              {item.type_1c > 0 && <span>  ({item.type_1c})</span>} 


              {item.plenka > " " && <span>  {item.plenka}</span>}
              {item.plenka_nomer > 0 && <span>/{item.plenka_nomer}</span>}
              {item.plenka_partiya > 0 && <span>/{item.plenka_partiya}</span>}
              {item.podon > " " && <span>  ({item.podon})</span>}
            </div>
          ))
      ) : (
        <p>Немає даних для відображення</p>
      )}
    </div>
  );
};

export default InfoComponent;
