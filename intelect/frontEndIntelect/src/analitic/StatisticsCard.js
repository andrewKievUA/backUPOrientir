import React from 'react';
import { Card, Table } from 'react-bootstrap';

function StatisticsCard({ stats }) {
  return (
    <Card className="mt-5">
      <Card.Body>
        <Card.Title className="h2">Загальні показники</Card.Title>
        <Card.Text>
          Загальна кількість палет: <strong>{stats.totalPallets}    ({stats.totalKubatura.toFixed(3)}  м.куб)</strong> 
        </Card.Text>
        <Card.Text>
        Об'єм браку в готовій продукції: <strong>{stats.totalKubaturaBrak.toFixed(3)} куб.м ({((stats.totalKubaturaBrak / stats.totalKubatura) * 100).toFixed(2)}%від загального об'єму)</strong> 
        </Card.Text>
        <Card.Text>
          Кількість палет із браком більше 5%: <strong>{stats.defectiveCount}</strong>
        </Card.Text>

        {/* Таблица  розмір блоку кількість випущених палет кількість виявлених дефектів загальний об'єм куб крапка М об'єм браку відсоток браку*/}
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Розмір блоку</th>
              <th>Кількість випущених палет</th>
              <th>Об'єм (м.куб)</th>
              <th>Кількість виявлених дефектів</th>
              <th>Об'єм браку (м.куб)</th>
              <th>Відсоток браку (%)</th> {/* Новая колонка для процента брака */}
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.sizes).map(([size, { count, num_defects, kubatura, kubaturaBrak }]) => (
              <tr key={size}>
                <td>600*{size}*200</td>
                <td>{count}</td>
                <td>{kubatura.toFixed(2)}</td>
                <td>{num_defects}</td>
                <td>{kubaturaBrak.toFixed(2)}</td> {/* Брак кубов */}
                <td>{((kubaturaBrak / kubatura) * 100).toFixed(2)}</td> {/* Процент брака */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default StatisticsCard;
