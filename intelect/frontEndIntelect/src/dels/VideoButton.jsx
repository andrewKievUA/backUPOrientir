import React from 'react';

const VideoButton = () => {
    const handleClick = () => {
        window.open('http://192.168.10.44:5055/video_feed', '_blank');
    };

    return (
        <button onClick={handleClick}>
            Открыть видео поток
        </button>
    );
};

export default VideoButton;
