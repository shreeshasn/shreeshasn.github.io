import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { playSynthSound } from '../utils/audio';

export const MobileWarning: React.FC = () => {
  const { isSoundEnabled } = usePortfolio();
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem('ssn_mobile_warning_dismissed') === 'true';
    } catch {
      return true;
    }
  });

  const handleDismiss = () => {
    playSynthSound('click', isSoundEnabled);
    localStorage.setItem('ssn_mobile_warning_dismissed', 'true');
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div
      className="mobile-warning-container"
      style={{
        position: 'fixed',
        bottom: 'var(--spacing-lg)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - var(--spacing-xxl))',
        maxWidth: '560px',
        backgroundColor: 'var(--color-surface-card)',
        border: '1px solid var(--color-warning)',
        borderRadius: 'var(--rounded-sm)',
        padding: 'var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        zIndex: 9999,
        fontFamily: 'var(--font-mono)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
        <span style={{ color: 'var(--color-warning)', fontWeight: 700 }}>[!]</span>
        <div style={{ flex: 1 }}>
          <p className="caption-md" style={{ color: 'var(--color-ink)', lineHeight: '1.4' }}>
            <strong>NOTICE:</strong> This terminal-brutalist artifact is optimized for desktop viewports. 
            A <strong>mouse & keyboard</strong> are recommended to experience full spatial audio, 3D hologram cards, and the interactive skill force graph.
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: '1px solid var(--color-hairline-strong)',
            borderRadius: 'var(--rounded-sm)',
            padding: '2px 10px',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          [ DISMISS ]
        </button>
      </div>

      <style>{`
        @media (min-width: 1025px) {
          .mobile-warning-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
