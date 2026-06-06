import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DynamicIcon } from '../DynamicIcon';

export const CertBadgeGrid: React.FC = () => {
  const { certifications, isDarkMode } = usePortfolio();
  const visible = certifications.filter((c) => !c.hideFromPublic);

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
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Certifications</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 'var(--spacing-xs) 0 0 0' }}>
            $ cat /certifications
          </p>
        </div>

        <div
          className="cert-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--spacing-lg)',
          }}
        >
          {visible.map((cert) => (
            <div
              key={cert.id}
              className="cert-card hairline-border"
              style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: isDarkMode ? 'rgba(15, 0, 0, 0.6)' : 'var(--color-surface-soft)',
                display: 'flex',
                gap: 'var(--spacing-lg)',
                alignItems: 'flex-start',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shield/Checkmark */}
              <div
                style={{
                  flexShrink: 0,
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-success)',
                }}
              >
                <DynamicIcon name={cert.icon || 'ShieldCheck'} size={28} />
              </div>

              <div style={{ flex: 1 }}>
                <span className="caption-md" style={{ color: 'var(--color-success)', fontWeight: 700, letterSpacing: '1px' }}>
                  ✓ VERIFIED CREDENTIAL
                </span>

                <h3 className="body-strong" style={{ color: 'var(--color-ink)', margin: 'var(--spacing-xs) 0 0 0' }}>
                  {cert.name}
                </h3>

                <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 'var(--spacing-xs) 0 0 0' }}>
                  ISSUED BY: {cert.issuer}
                </p>

                <span className="caption-md" style={{ color: 'var(--color-stone)', display: 'block', marginTop: 'var(--spacing-xs)' }}>
                  ISSUED // {cert.issueDate}
                </span>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: 'var(--spacing-md)',
                      color: 'var(--color-ink)',
                      fontSize: '0.8125rem',
                      textDecoration: 'underline',
                    }}
                  >
                    [→] Verify
                  </a>
                )}
              </div>

              {/* Holographic shimmer overlay */}
              <div className="cert-shimmer" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .cert-card { position: relative; transition: border-color 0.3s ease; }
        .cert-shimmer {
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(253,252,252,0.08), transparent);
          transition: left 0.6s ease;
          pointer-events: none;
        }
        .cert-card:hover .cert-shimmer { left: 200%; }
        .cert-card:hover { border-color: var(--color-success) !important; }
        @media (min-width: 769px) {
          .cert-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
};
