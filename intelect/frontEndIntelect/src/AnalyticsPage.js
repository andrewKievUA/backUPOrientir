import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Spinner, Alert } from 'react-bootstrap';
import PalletForm from "./analitic/PalletForm"; // Імпортуємо форму
import { calculateStatistics } from './analitic/statistics';
import DefectivePalletsTable from './analitic/DefectivePalletsTable';
import StatisticsCard from './analitic/StatisticsCard'; // Путь к вашему компоненту StatsCard
import PalletsListCard from './analitic/PalletsListCard';
import { formatDate } from './analitic/dateUtils';

const AnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [palletNumberFrom, setPalletNumberFrom] = useState(40400);
  const [palletNumberTo, setPalletNumberTo] = useState(40500);
  const [palletYear, setPalletYear] = useState(new Date().getFullYear()); // Установка текущего года
  const [palletMonth, setPalletMonth] = useState(new Date().getMonth() + 1); // Установка текущего месяца

  useEffect(() => {
    fetchMaxPaletteNumber();
  }, []);

  const fetchMaxPaletteNumber = async () => {
    try {
      const response = await axios.get('http://192.168.10.44:3069/getNumber');
      const number = response.data.number;
      setPalletNumberTo(number-10);
      setPalletNumberFrom(number - 80); // Установка значения из fetchMaxPaletteNumber
    } catch (error) {
      console.error('Error fetching the number:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://192.168.10.44:3010/analytics-all`, {
        params: {
          pallet_number_from: palletNumberFrom,
          pallet_number_to: palletNumberTo,
          pallet_year: palletYear,
          pallet_month: palletMonth,
          side: "B"
        }
      });
      setData(response.data);
    } catch (err) {
      console.error("Помилка при отриманні даних:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const stats = calculateStatistics(data);
  console.log(stats);

  return (
    <Container className="mt-4">
      <PalletForm
        palletNumberFrom={palletNumberFrom}
        palletNumberTo={palletNumberTo}
        palletYear={palletYear}
        palletMonth={palletMonth}
        setPalletNumberFrom={setPalletNumberFrom}
        setPalletNumberTo={setPalletNumberTo}
        setPalletYear={setPalletYear}
        setPalletMonth={setPalletMonth}
        handleSubmit={handleSubmit}
      />
      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      )}
      {error && (
        <Alert variant="danger" className="mt-4">
          Помилка: {error.message}
        </Alert>
      )}
      {data.length > 0 && (
        <>
          <StatisticsCard stats={stats} />
          <DefectivePalletsTable
            stats={stats}
            palletYear={palletYear}
            palletMonth={palletMonth}
          />
          <PalletsListCard data={data} palletYear={palletYear} palletMonth={palletMonth} formatDate={formatDate} />
        </>
      )}
    </Container>
  );
};

export default AnalyticsPage;
