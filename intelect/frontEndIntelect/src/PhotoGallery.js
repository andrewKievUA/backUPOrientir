// src/PhotoGallery.js
import React from 'react';
import { Image, Row, Col } from 'react-bootstrap';

const PhotoGallery = ({ photoUrls, handlePhotoClick }) => (
  <Row>
    {Object.entries(photoUrls).map(([key, url]) => (
      <Col md={6} className="mb-6" key={key}>
        {url && (
          <Image
            src={url}
            alt={`Фото ${key}`}
            thumbnail
            className="w-400 cursor-pointer"
            style={{ maxHeight: '1800px', objectFit: 'fill' }}
            onClick={() => handlePhotoClick(url)}
          />
        )}
      </Col>
    ))}
  </Row>
);

export default PhotoGallery;
