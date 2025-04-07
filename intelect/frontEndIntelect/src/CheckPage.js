import React, { useState, useEffect } from 'react';
import { Table, Container, Form, Button, Row, Col } from 'react-bootstrap';
import { formatDate } from './analitic/dateUtils';
import axios from 'axios';
import months from './data/months'; // Импортируйте массив



const PalletData = () => {
    const [data, setData] = useState([]);
    const [day, setDay] = useState(new Date().getDate()); // Текущий день
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Текущий месяц (0-11)
    const [year, setYear] = useState(new Date().getFullYear()); // Текущий год

    

    useEffect(() => {
        fetchData();
    }, [day, month, year]); // Зависимости для вызова fetchData

    const fetchData = async () => {
        try {
            const response = await axios.get('http://192.168.10.44:3010/api/pallets', {
                params: { day, month, year }
            });
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        fetchData(); // Вызываем fetchData для получения данных
    };

    return (
        <Container>
            <h2 className="mt-4">Дані палет</h2>

            {/* Форма ввода для выбора даты */}
            <Form onSubmit={handleSubmit} className="mb-4">
                <Row>
                    <Col md={4}>
                        <Form.Group controlId="formDay">
                            <Form.Label>День</Form.Label>
                            <Form.Control
                                type="number"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                min="1"
                                max="31"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formMonth">
                            <Form.Label>Місяць</Form.Label>
                            <Form.Control
                                as="select"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                {months.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    
         
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formYear">
                            <Form.Label>Рік</Form.Label>
                            <Form.Control
                                type="number"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                min="2000"
                                max={new Date().getFullYear()} // Максимум - текущий год
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button type="submit" variant="outline-dark">Запросити дані</Button>
            </Form>

            {/* Таблица для отображения данных */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Час</th>
                        <th>Різниця контрольної точки</th>
                        <th>Номер відстеження</th>
                        <th>Номер принтера</th>

                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{formatDate(item.time)}</td>
                            <td>{item.checkPoint_Diff}</td>
                            <td>{item.numberTrackingPalete}</td>
                            <td>{item.printerNumber}</td>

                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default PalletData;
