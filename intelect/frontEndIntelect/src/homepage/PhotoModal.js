 // src/PhotoModal.js
import React from 'react';
import { Modal, Image, Button } from 'react-bootstrap';

const PhotoModal = ({ showModal, selectedPhoto, handleCloseModal }) => (
  <Modal show={showModal} onHide={handleCloseModal} size="lg">
    <Modal.Body>
      <Image
        src={selectedPhoto}
        alt="Увеличенное фото"
        fluid
        style={{ maxHeight: '80vh', objectFit: 'contain' }}
      />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>Закрыть</Button>
    </Modal.Footer>
  </Modal>
);

export default PhotoModal;
