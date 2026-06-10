import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AboutPanel: React.FC = () => {
  const { identity } = usePortfolio();

  const fields = [
    { key: 'FULL_NAME', value: identity.fullName },
    { key: 'TITLE', value: identity.title },
    { key: 'SUBTITLE', value: identity.subtitle },
    { key: 'LOCATION', value: `${identity.location.city}, ${identity.location.state}, ${identity.location.country}` },
    { key: 'TIMEZONE', value: identity.location.timezone },
    { key: 'STATUS', value: identity.status },
    { key: 'EMAIL', value: identity.email },
  ];

  return (
    <section className="content-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-canvas)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)',
        }}
      >
        {/* Box Header inside the box */}
        <div style={{ borderBottom: '1px dashed var(--color-hairline)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] About</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 'var(--spacing-xs) 0 0 0' }}>
            $ cat /about
          </p>
        </div>

        {fields.map((f) => (
          <div
            key={f.key}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 'var(--spacing-md)',
              fontSize: '0.875rem',
            }}
          >
            <span style={{ color: 'var(--color-stone)', minWidth: '130px', fontWeight: 500 }}>
              [{f.key}]
            </span>
            <span style={{ color: 'var(--color-ink)', flex: 1, minWidth: '200px', wordBreak: 'break-all' }}>
              {f.key === 'EMAIL' ? (
                <a href={`mailto:${f.value}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                  {f.value}
                </a>
              ) : (
                f.value
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
