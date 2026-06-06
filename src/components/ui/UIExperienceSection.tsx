import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { playSynthSound } from '../../utils/audio';

export const UIExperienceSection: React.FC = () => {
  const { workExperience, setSelectedProjectId, isSoundEnabled } = usePortfolio();
  const visible = workExperience.filter((w) => !w.hideFromPublic);

  return (
    <section id="experience" className="section-spacing content-container" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
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
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Experience</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
            // Professional work history and contributions.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {visible.map((exp) => (
            <div
              key={exp.id}
              className="hairline-border"
              style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--color-canvas)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                <div>
                  <h3 className="body-strong" style={{ color: 'var(--color-ink)', margin: 0 }}>{exp.title}</h3>
                  <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 0 }}>{exp.company} — {exp.location}</p>
                </div>
                <span className="caption-md" style={{ color: 'var(--color-stone)' }}>{exp.period}</span>
              </div>

              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                {exp.highlights.map((h, i) => (
                  <li key={i} className="body-md" style={{ color: 'var(--color-body)', fontSize: '0.875rem' }}>{h}</li>
                ))}
              </ul>

              {exp.skillsUsed.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                  {exp.skillsUsed.map((s) => (
                    <span key={s} className="badge-news" style={{ fontSize: '0.6875rem', backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-mute)', border: '1px solid var(--color-hairline)' }}>
                      #{s}
                    </span>
                  ))}
                </div>
              )}

              {exp.relatedProjectId && (
                <div
                  className="hairline-border"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--color-surface-soft)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    marginTop: 'var(--spacing-xs)'
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-body)', fontFamily: 'var(--font-mono)' }}>
                    [!] Linked Project: <strong style={{ color: 'var(--color-ink)' }}>VoxGlobal AI</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProjectId(exp.relatedProjectId!);
                      playSynthSound('click', isSoundEnabled);
                      const element = document.getElementById('projects');
                      if (element) {
                        const navHeight = 56;
                        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                        window.scrollTo({ top: elementPosition - navHeight, behavior: 'smooth' });
                      }
                    }}
                    className="button-secondary"
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 12px',
                      height: '30px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    View Project [→]
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
