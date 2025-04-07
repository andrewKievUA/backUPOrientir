import React from 'react';
import { Image } from 'react-bootstrap';

function PhotoGallery({ photoUrls, onFirstPhotoClick, onSecondPhotoClick }) {
  return (
    <div className="photo-gallery" style={{ display: 'flex', gap: '10px' }}>
      <Image
        style={{ width: '50%', maxHeight: '90vh', objectFit: 'contain' }}
        src={photoUrls.B || photoUrls.A}
        onClick={() => onFirstPhotoClick()}
        className="gallery-photo"
      />
      <Image
        style={{ width: '50%', maxHeight: '90vh', objectFit: 'contain' }}
        src={photoUrls.D || photoUrls.C}
        onClick={() => onSecondPhotoClick()}
        className="gallery-photo"
      />
    </div>
  );
}

export default PhotoGallery;