import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DynamicIcon } from '../DynamicIcon';

export const UIAchievementsSection: React.FC = () => {
  const { achievements, certifications } = usePortfolio();
  const visibleAch = achievements.filter((a) => !a.hideFromPublic);
  const visibleCert = certifications.filter((c) => !c.hideFromPublic);

  return (
    <section id="achievements" className="section-spacing content-container" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
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
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Achievements &amp; Certifications</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
            // Recognitions and verified credentials.
          </p>
        </div>

        {/* Achievements */}
        {visibleAch.length > 0 && (
          <div>
            <h3 className="heading-sm" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-md)', fontSize: '0.875rem', letterSpacing: '1px' }}>
              ACHIEVEMENTS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {visibleAch.map((ach) => (
                <div key={ach.id} className="hairline-border" style={{ padding: 'var(--spacing-md) var(--spacing-xl)', backgroundColor: 'var(--color-canvas)', display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-ink)', flexShrink: 0, marginTop: '2px' }}>
                    <DynamicIcon name={ach.icon} size={18} />
                  </span>
                  <div>
                    <h4 className="body-strong" style={{ color: 'var(--color-ink)', margin: 0 }}>{ach.title}</h4>
                    <p className="caption-md" style={{ color: 'var(--color-body)', margin: 0 }}>{ach.description}</p>
                    <span className="caption-md" style={{ color: 'var(--color-stone)' }}>{ach.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {visibleCert.length > 0 && (
          <div>
            <h3 className="heading-sm" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-md)', fontSize: '0.875rem', letterSpacing: '1px' }}>
              CERTIFICATIONS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {visibleCert.map((cert) => (
                <div key={cert.id} className="hairline-border" style={{ padding: 'var(--spacing-md) var(--spacing-xl)', backgroundColor: 'var(--color-canvas)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                  <div>
                    <h4 className="body-strong" style={{ color: 'var(--color-ink)', margin: 0 }}>{cert.name}</h4>
                    <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 0 }}>Issued by: {cert.issuer} · {cert.issueDate}</p>
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover-reveal"
                      style={{ color: 'var(--color-ink)', fontSize: '0.8125rem', textDecoration: 'underline' }}
                    >
                      [→] Verify
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
