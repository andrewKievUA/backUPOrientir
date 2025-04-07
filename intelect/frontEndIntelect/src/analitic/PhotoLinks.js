import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const PhotoLinks = ({ palletYear, palletMonth, palletNumber }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');

  const handleClick = (photo) => {
    const photoUrl = `http://192.168.10.44:3070/photo/${palletYear}/${palletMonth}/${palletNumber}/${photo}`;
    setCurrentPhotoUrl(photoUrl);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentPhotoUrl('');
  };

  return (
    <span>
      {['A', 'B', 'C', 'D'].map((photo) => (
        <a
          key={photo}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClick(photo);
          }}
        >
          <i className="fas fa-camera"></i> {/* Иконка фотоаппарата */}
        </a>
      ))}

      <Modal show={showModal} onHide={handleClose} centered size="xl">
        <Modal.Body style={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={currentPhotoUrl}
            alt="Photo preview"
            style={{ width: '90%', height: 'auto', cursor: 'pointer' }}
            onClick={handleClose}
            onError={handleClose}
          />
        </Modal.Body>
      </Modal>
    </span>
  );
};

export default PhotoLinks;
