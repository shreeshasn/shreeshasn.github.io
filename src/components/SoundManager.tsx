import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { startAmbientHum, stopAmbientHum } from '../utils/audio';

export const SoundManager: React.FC = () => {
  const { isSoundEnabled, featureFlags } = usePortfolio();

  useEffect(() => {
    if (featureFlags.enableSound) {
      if (isSoundEnabled) {
        startAmbientHum(true);
      } else {
        stopAmbientHum();
      }
    }
    return () => {
      stopAmbientHum();
    };
  }, [isSoundEnabled, featureFlags.enableSound]);

  return null;
};
