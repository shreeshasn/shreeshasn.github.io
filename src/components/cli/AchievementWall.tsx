import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { DynamicIcon } from '../DynamicIcon';

export const AchievementWall: React.FC = () => {
  const { achievements, isDarkMode } = usePortfolio();
  const visible = achievements.filter((a) => !a.hideFromPublic);

  const tierStyles: Record<string, { borderColor: string; label: string }> = {
    high: { borderColor: 'var(--color-ink)', label: '★ LEGENDARY' },
    medium: { borderColor: 'var(--color-mute)', label: '◆ RARE' },
    normal: { borderColor: 'var(--color-stone)', label: '● COMMON' },
  };

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
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Achievements</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 'var(--spacing-xs) 0 0 0' }}>
            $ cat /achievements
          </p>
        </div>

        <div
          className="ach-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--spacing-lg)',
          }}
        >
          {visible.map((ach, i) => {
            const tier = tierStyles[ach.importance] || tierStyles.normal;

            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12, duration: 0.35, ease: 'easeOut' }}
                className="ach-card"
                style={{
                  padding: 'var(--spacing-xl)',
                  backgroundColor: isDarkMode ? 'rgba(15, 0, 0, 0.6)' : 'var(--color-surface-soft)',
                  border: `2px solid ${tier.borderColor}`,
                  display: 'flex',
                  gap: 'var(--spacing-lg)',
                  alignItems: 'flex-start',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Achievement Icon */}
                <div
                  style={{
                    flexShrink: 0,
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${tier.borderColor}`,
                    color: 'var(--color-ink)',
                  }}
                >
                  <DynamicIcon name={ach.icon} size={24} />
                </div>

                <div style={{ flex: 1 }}>
                  {/* Tier Badge */}
                  <span className="caption-md" style={{ color: tier.borderColor, fontWeight: 700, letterSpacing: '1px' }}>
                    {tier.label}
                  </span>

                  <h3 className="body-strong" style={{ color: 'var(--color-ink)', margin: 'var(--spacing-xs) 0 0 0' }}>
                    🏆 ACHIEVEMENT UNLOCKED
                  </h3>

                  <p className="body-md" style={{ color: 'var(--color-ink)', margin: 'var(--spacing-xs) 0 0 0', fontWeight: 500 }}>
                    {ach.title}
                  </p>

                  <p className="caption-md" style={{ color: 'var(--color-body)', margin: 'var(--spacing-xs) 0 0 0' }}>
                    {ach.description}
                  </p>

                  <span className="caption-md" style={{ color: 'var(--color-stone)', display: 'block', marginTop: 'var(--spacing-sm)' }}>
                    UNLOCKED: {ach.date}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .ach-card { transition: border-color 0.3s ease; }
        .ach-card:hover { border-color: var(--color-accent) !important; }
        @media (min-width: 769px) {
          .ach-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
};
