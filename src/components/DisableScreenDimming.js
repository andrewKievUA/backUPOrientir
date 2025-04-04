import React, { useEffect } from 'react';

const DisableScreenDimming = () => {
  useEffect(() => {
    let wakeLock = null;

    const requestWakeLock = async () => {
      try {
        const wakeLockObj = await navigator.wakeLock.request('screen');
        wakeLock = wakeLockObj.createDisabler();
        console.log('Screen wake lock is active');
      } catch (error) {
        console.error('Failed to request screen wake lock:', error);
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLock) {
        wakeLock.release();
        console.log('Screen wake lock is released');
      }
    };
  }, []);

  return null;
};

export default DisableScreenDimming;
