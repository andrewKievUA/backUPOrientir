import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';

const Filter = () => {
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        axios.get('http://192.168.10.44:3093/photos') // Изменено IP
            .then(response => setPhotos(response.data))
            .catch(error => console.error('Ошибка загрузки фото:', error));
    }, []);

    const movePhoto = (folder) => {
        const filename = photos[currentPhotoIndex];
        axios.post('http://192.168.10.44:3093/move', { filename, folder }) // Изменено IP
            .then(() => {
                setPhotos(prev => prev.filter((_, index) => index !== currentPhotoIndex));
                setCurrentPhotoIndex(0);
            })
            .catch(error => console.error('Ошибка перемещения фото:', error));
    };

    const deletePhoto = () => {
        const filename = photos[currentPhotoIndex];
        axios.delete('http://192.168.10.44:3093/delete', { data: { filename } }) // Изменено IP
            .then(() => {
                setPhotos(prev => prev.filter((_, index) => index !== currentPhotoIndex));
                setCurrentPhotoIndex(0);
            })
            .catch(error => console.error('Ошибка удаления фото:', error));
    };

    if (photos.length === 0) return <p>Фотографии не найдены</p>;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8}>
                    <Image src={`http://192.168.10.44:3093/otbitosti/60-80/${photos[currentPhotoIndex]}`} fluid /> {/* Изменено IP */}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="danger" onClick={() => movePhoto('брак')}>Брак</Button>
                </Col>
                <Col>
                    <Button variant="success" onClick={() => movePhoto('небрак')}>Небрак</Button>
                </Col>
                <Col>
                    <Button variant="warning" onClick={() => movePhoto('под вопросом')}>Под вопросом</Button>
                </Col>
                <Col>
                    <Button variant="dark" onClick={deletePhoto}>Удалить</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Filter;
