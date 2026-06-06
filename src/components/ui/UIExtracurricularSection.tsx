import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DynamicIcon } from '../DynamicIcon';

export const UIExtracurricularSection: React.FC = () => {
  const { extracurricular } = usePortfolio();
  const visible = extracurricular.filter((e) => !e.hideFromPublic);

  if (visible.length === 0) return null;

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
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Extracurricular</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
            // Beyond the codebase.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {visible.map((item) => (
            <div key={item.id} className="hairline-border" style={{ padding: 'var(--spacing-md) var(--spacing-xl)', backgroundColor: 'var(--color-canvas)', display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--color-ink)', flexShrink: 0, marginTop: '2px' }}>
                <DynamicIcon name={item.icon} size={18} />
              </span>
              <div>
                <h4 className="body-strong" style={{ color: 'var(--color-ink)', margin: 0 }}>{item.title}</h4>
                <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 0 }}>
                  {item.role} @ {item.organization} · {item.period}
                </p>
                <p className="body-md" style={{ color: 'var(--color-body)', margin: 'var(--spacing-xs) 0 0 0', fontSize: '0.875rem' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
