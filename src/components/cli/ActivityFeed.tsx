import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';

// Generate stable pseudo-random hex hash from a seed string
function hashFromSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(7, '0').slice(0, 7);
}

export const ActivityFeed: React.FC = () => {
  const { extracurricular, identity } = usePortfolio();
  const visible = extracurricular.filter((e) => !e.hideFromPublic);

  const entries = useMemo(() =>
    visible.map((item) => ({
      ...item,
      hash: hashFromSeed(item.id + item.title),
    })),
    [visible]
  );

  return (
    <section className="content-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-canvas)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)',
        }}
      >
        {/* Box Header inside the box */}
        <div style={{ borderBottom: '1px dashed var(--color-hairline)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Extracurricular</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 'var(--spacing-xs) 0 0 0' }}>
            $ git log --oneline --graph /extracurricular
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', fontFamily: 'var(--font-mono)' }}>
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
            >
              {/* Commit Header */}
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.8125rem' }}>
                  commit {entry.hash}
                </span>
                <span style={{ color: 'var(--color-stone)', fontSize: '0.8125rem' }}>
                  — {entry.period}
                </span>
              </div>

              {/* Author */}
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-mute)' }}>
                Author: {identity.fullName} &lt;{identity.email}&gt;
              </div>

              {/* Commit Message */}
              <div
                style={{
                  marginTop: 'var(--spacing-sm)',
                  paddingLeft: 'var(--spacing-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div style={{ color: 'var(--color-ink)', fontWeight: 500, fontSize: '0.875rem' }}>
                  {entry.role} @ {entry.organization}
                </div>
                <div style={{ color: 'var(--color-body)', fontSize: '0.8125rem' }}>
                  {entry.description}
                </div>
              </div>

              {/* Separator */}
              {i < entries.length - 1 && (
                <div
                  style={{
                    marginTop: 'var(--spacing-md)',
                    borderBottom: '1px dashed var(--color-hairline)',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
