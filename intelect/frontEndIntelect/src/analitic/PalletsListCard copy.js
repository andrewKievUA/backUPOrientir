// PalletsListCard.js
import React from 'react';
import { Card, Table } from 'react-bootstrap';
import PhotoLinks from './PhotoLinks';

function PalletsListCard({ data, palletYear, palletMonth, formatDate }) {
  // Допустимые значения massivePart
  const validParts = [1, 2, 3];
  let oldValue = null; // Изначально нет предыдущего значения для massivePart
  let oldPalletNumber = null; // Изначально нет предыдущего номера поддона

  return (
    <Card className="mt-5">
      <Card.Body>
        <Card.Title className="h3">Список всіх палет:</Card.Title>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Номер піддону <br /> (частина масиву)</th>
              <th>Номенклатура</th>
              <th>Відсоток браку  <br /> (Кількість виявлених дефектів)</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              // Определяем текущее значение partValue
              const partValue = item.massivePart === 3 ? 2 : item.massivePart === 4 ? 3 : item.massivePart;

              // Проверка на совпадение с предыдущим значением
              const isDuplicate = oldValue === partValue;

              // Проверка на специфические ошибки
              const hasError = (oldValue === 3 && partValue === 2) || (oldValue === 1 && partValue === 3);

              // Проверка на правильность номера поддона
              const isPalletNumberValid = oldPalletNumber === null || item.pallet_number === oldPalletNumber + 1;

              // Обновляем старые значения
              oldValue = partValue;
              oldPalletNumber = item.pallet_number;

              // Определяем текст для вывода massivePart
              const partValueText = isDuplicate || hasError ? `${partValue} (error)` : partValue;

              // Определяем текст для вывода номера поддона
              const palletNumberText = isPalletNumberValid ? item.pallet_number : `${item.pallet_number} (error)`;

              return (
                <tr key={item.id}>
                  <td>
                    
                    {palletNumberText}
                     (
                    {partValueText}
                    )
                  </td>
                  <td>601*{item.type_1c}*200</td>
                  <td>{Math.round(item.brak_persent_total * 100) / 100}% ({item.num_defects}шт)</td>
                  <td>
                    {formatDate(item.timestamp)}
                    <PhotoLinks
                      palletYear={palletYear}
                      palletMonth={palletMonth}
                      palletNumber={item.pallet_number}
                    />
                    ({item.smena} зм)
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default PalletsListCard;
