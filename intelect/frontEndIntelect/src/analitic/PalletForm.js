import React, { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import months from '../data/months'; // Импортируйте массив months

const PalletForm = ({
  palletNumberFrom,
  palletNumberTo,
  palletYear,
  palletMonth,
  setPalletNumberFrom,
  setPalletNumberTo,
  setPalletYear,
  setPalletMonth,
  handleSubmit,
}) => {
  useEffect(() => {
    // Получаем текущий месяц (1-12) и устанавливаем в состояние
    const currentMonth = new Date().getMonth() + 1; // getMonth() возвращает 0-11
    setPalletMonth(currentMonth);
  }, [setPalletMonth]); // Зависимость только на функцию установки состояния

  return (
    <>
      <h2 className="text-center mb-4">
        Аналіз якості палет з готовою продукцією за місяць 
        <Form.Select
          value={palletMonth}
          onChange={(e) => setPalletMonth(e.target.value)}
          className="d-inline w-auto mx-2"
          size="sm" // Уменьшение размера ввода
        >
          <option value="">Оберіть місяць</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </Form.Select>
        рік
        <Form.Control
          type="number"
          value={palletYear}
          onChange={(e) => setPalletYear(e.target.value)}
          className="d-inline w-auto mx-2"
          placeholder="Рік"
          size="sm" // Уменьшение размера ввода
        /> 
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            З (номеру піддону)
            <Form.Control
              type="number"
              value={palletNumberFrom}
              onChange={(e) => setPalletNumberFrom(e.target.value)}
              className="d-inline w-auto mx-2"
              placeholder="Номер піддону від"
              size="sm" // Уменьшение размера ввода
            />
          </span>
          <span>
            по (номер піддону)
            <Form.Control
              type="number"
              value={palletNumberTo}
              onChange={(e) => setPalletNumberTo(e.target.value)}
              className="d-inline w-auto mx-2"
              placeholder="Номер піддону до"
              size="sm" // Уменьшение размера ввода
            />
          </span>
        </div>
      </h2>
      <Button variant="outline-dark" type="submit" className="mt-3" onClick={handleSubmit}>
        Отримати дані
      </Button>
    </>
  );
};

export default PalletForm;
