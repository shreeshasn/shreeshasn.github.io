import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DynamicIcon } from '../DynamicIcon';
import { highlightKeywords } from '../../utils/text';

export const SummaryPanel: React.FC = () => {
  const { bio, meta } = usePortfolio();

  // Split longBio into bullet points by sentence
  const bullets = bio.longBio
    .split(/\.\s+/)
    .filter((s) => s.trim().length > 0)
    .map((s) => (s.endsWith('.') ? s : s + '.'));

  return (
    <section className="content-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-canvas)',
        }}
      >
        {/* Box Header inside the box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', borderBottom: '1px dashed var(--color-hairline)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
          <span style={{ color: 'var(--color-ink)' }}>
            <DynamicIcon name="Lightbulb" size={28} />
          </span>
          <div>
            <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Summary</h2>
            <p className="caption-md" style={{ color: 'var(--color-mute)', margin: '2px 0 0 0' }}>
              $ cat /summary
            </p>
          </div>
        </div>

        <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {bullets.map((bullet, i) => (
            <li key={i} className="body-md" style={{ color: 'var(--color-body)', lineHeight: 1.7 }}>
              {highlightKeywords(bullet, meta.highlightKeywords || [])}
            </li>
          ))}
        </ul>

        {bio.philosophy && (
          <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-md)', borderTop: '1px dashed var(--color-hairline)' }}>
            <span className="caption-md" style={{ color: 'var(--color-stone)' }}>PHILOSOPHY //</span>
            <p className="body-md" style={{ color: 'var(--color-ink)', margin: 'var(--spacing-xs) 0 0 0', fontStyle: 'italic' }}>
              "{bio.philosophy}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
