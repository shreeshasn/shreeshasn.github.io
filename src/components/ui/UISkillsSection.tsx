import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const UISkillsSection: React.FC = () => {
  const { skills } = usePortfolio();
  const visible = skills.filter((s) => !s.hideFromPublic);

  // Group by category
  const groups: Record<string, typeof visible> = {};
  visible.forEach((s) => {
    const cat = s.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });

  const categoryLabels: Record<string, string> = {
    language: 'Languages',
    framework: 'Frameworks',
    library: 'Libraries',
    tool: 'Tools & Infrastructure',
  };

  return (
    <section id="skills" className="section-spacing content-container" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
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
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Skills</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
            // Technical proficiencies grouped by domain.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          {Object.entries(groups).map(([category, items]) => (
            <div key={category}>
              <h3
                className="heading-sm"
                style={{
                  color: 'var(--color-ink)',
                  marginBottom: 'var(--spacing-md)',
                  fontSize: '0.875rem',
                  letterSpacing: '1px',
                }}
              >
                {(categoryLabels[category] || category).toUpperCase()}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                {items.map((skill) => (
                  <div
                    key={skill.id}
                    className="hairline-border transition-all-300"
                    style={{
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      backgroundColor: 'var(--color-canvas)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                      {skill.name}
                    </span>
                    <span className="caption-md" style={{ color: 'var(--color-stone)' }}>
                      {skill.proficiency}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
