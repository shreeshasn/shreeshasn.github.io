import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const UIEducationSection: React.FC = () => {
  const { education } = usePortfolio();
  const visible = education.filter((e) => !e.hideFromPublic);

  return (
    <section id="education" className="section-spacing content-container" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
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
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Education</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
            // Academic milestones and qualifications.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {visible.map((edu) => (
            <div
              key={edu.id}
              className="hairline-border"
              style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--color-canvas)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                <div>
                  <h3 className="body-strong" style={{ color: 'var(--color-ink)', margin: 0 }}>
                    {edu.institution}
                  </h3>
                  <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 0 }}>
                    {edu.degree ? `${edu.degree} — ${edu.field}` : edu.field}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="caption-md" style={{ color: 'var(--color-stone)' }}>
                    {edu.startDate} → {edu.endDate}
                  </span>
                  <div className="body-strong" style={{ color: 'var(--color-ink)', fontSize: '0.875rem' }}>
                    {edu.grade}
                  </div>
                </div>
              </div>
              {edu.location && (
                <span className="caption-md" style={{ color: 'var(--color-stone)' }}>📍 {edu.location}</span>
              )}
              {edu.highlights.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-xs)' }}>
                  {edu.highlights.map((h, i) => (
                    <span key={i} className="badge-news" style={{ fontSize: '0.6875rem', backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-mute)', border: '1px solid var(--color-hairline)' }}>
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
