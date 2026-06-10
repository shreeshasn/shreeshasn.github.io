import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SKILL_TO_CLUSTER } from '../../utils/skills';

export const UISkillsSection: React.FC = () => {
  const { skills } = usePortfolio();
  const visible = skills.filter((s) => !s.hideFromPublic);

  // Group by cluster
  const groups: Record<string, typeof visible> = {};
  visible.forEach((s) => {
    const clusterId = SKILL_TO_CLUSTER[s.id] || 'languages';
    if (!groups[clusterId]) groups[clusterId] = [];
    groups[clusterId].push(s);
  });

  const categoryLabels: Record<string, string> = {
    'core-competencies': 'Core Competencies',
    languages: 'Languages',
    frameworks: 'Frameworks',
    'ai-ml': 'AI / ML',
    'data-viz': 'Data & Viz',
    devops: 'DevOps',
    databases: 'Databases',
    architecture: 'Architecture',
    'platforms-tools': 'Platforms and Tools',
  };

  const categoryOrder = [
    'core-competencies',
    'languages',
    'frameworks',
    'ai-ml',
    'data-viz',
    'devops',
    'databases',
    'architecture',
    'platforms-tools'
  ];

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
          {categoryOrder.map((category) => {
            const items = groups[category];
            if (!items || items.length === 0) return null;
            return (
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
            );
          })}
        </div>
      </div>
    </section>
  );
};
