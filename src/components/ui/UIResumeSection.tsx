import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { playSynthSound } from '../../utils/audio';

export const UIResumeSection: React.FC = () => {
  const { resume, isSoundEnabled } = usePortfolio();

  return (
    <section className="section-spacing content-container" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-surface-soft)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)',
        }}
      >
        <div>
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Resume</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
            // Download the full document.
          </p>
        </div>

        <div
          className="hairline-border"
          style={{
            padding: 'var(--spacing-xl)',
            backgroundColor: 'var(--color-canvas)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)',
          }}
        >
          <div>
            <p className="body-strong" style={{ color: 'var(--color-ink)', margin: 0 }}>{resume.fileName}</p>
            <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 0 }}>PDF document — Google Drive</p>
          </div>
          <a
            href={resume.driveUrl}
            target="_blank"
            rel="noreferrer"
            className="button-primary"
            style={{ textDecoration: 'none' }}
            onClick={() => playSynthSound('click', isSoundEnabled)}
          >
            Download Resume [↓]
          </a>
        </div>
      </div>
    </section>
  );
};
