import React, { useState } from 'react';
import { Table, Button, Card } from 'react-bootstrap';
import PhotoLinks from './PhotoLinks';

function DefectivePalletsTable({ stats, palletYear, palletMonth }) {
  const [isTableVisible, setIsTableVisible] = useState(false);

  // Функция для изменения видимости таблицы
  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  // Функция для форматирования даты
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <Card className="mt-4 border-light shadow-sm">
      <Card.Body>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Палети із браком понад 5%:</h3>
          <Button
            onClick={toggleTableVisibility}
            variant="outline-dark"
            style={{ marginLeft: '10px' }}
          >
            {isTableVisible ? 'Сховати таблицю' : 'Показати таблицю'}
          </Button>
        </span>

        {isTableVisible && (
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Номер піддона</th>
                <th>Номенклатура</th>
                <th>Відсоток браку</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {stats.defectivePallets.map((item) => (
                <tr key={item.pallet_number}>
                  <td>{item.pallet_number}</td>
                  <td>600*{item.type_1c}*200</td>
                  <td>
                    {Math.round(item.brak_persent_total * 100) / 100}% ({item.num_defects}шт)
                  </td>
                  <td>
                    {formatDate(item.timestamp)}
                    <PhotoLinks
                      palletYear={palletYear}
                      palletMonth={palletMonth}
                      palletNumber={item.pallet_number}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default DefectivePalletsTable;
