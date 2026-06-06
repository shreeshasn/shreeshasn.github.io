import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { playSynthSound } from '../../utils/audio';

export const ResumeSection: React.FC = () => {
  const { resume, isSoundEnabled } = usePortfolio();

  return (
    <section className="content-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-canvas)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-lg)',
        }}
      >
        {/* Box Header inside the box */}
        <div style={{ borderBottom: '1px dashed var(--color-hairline)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Resume</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 'var(--spacing-xs) 0 0 0' }}>
            $ cat /resume
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)',
          }}
        >
          <div>
            <p className="body-strong" style={{ color: 'var(--color-ink)', margin: 0 }}>{resume.fileName}</p>
            <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 0 }}>PDF — hosted on Google Drive</p>
          </div>

          <a
            href={resume.driveUrl}
            target="_blank"
            rel="noreferrer"
            className="button-primary"
            style={{ textDecoration: 'none' }}
            onClick={() => playSynthSound('click', isSoundEnabled)}
          >
            Download [↓]
          </a>
        </div>
      </div>
    </section>
  );
};
