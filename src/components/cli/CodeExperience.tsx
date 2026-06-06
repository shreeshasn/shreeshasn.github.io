import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { usePortfolio } from '../../context/PortfolioContext';

export const CodeExperience: React.FC = () => {
  const { workExperience, isDarkMode, setSelectedProjectId } = usePortfolio();
  const visible = workExperience.filter((w) => !w.hideFromPublic);

  // Generate TypeScript code from work experience data
  // Generate TypeScript code from work experience data
  const generateCode = (): string => {
    const lines: string[] = [
      '// experience.config.ts — Work Experience',
      '',
      'const experience = [',
    ];

    visible.forEach((exp, i) => {
      lines.push('  {');
      lines.push(`    title: "${exp.title}",`);
      lines.push(`    company: "${exp.company}",`);
      lines.push(`    location: "${exp.location}",`);
      lines.push(`    period: "${exp.period}",`);
      lines.push(`    type: "${exp.type}",`);
      if (exp.relatedProjectId) {
        lines.push(`    relatedProjectId: "${exp.relatedProjectId}",`);
      }
      lines.push('    highlights: [');
      exp.highlights.forEach((h) => {
        lines.push(`      "${h}",`);
      });
      lines.push('    ],');
      lines.push(`  }${i < visible.length - 1 ? ',' : ''}`);
    });

    lines.push('];');

    return lines.join('\n');
  };

  const code = generateCode();
  const theme = isDarkMode ? themes.vsDark : themes.github;

  return (
    <section className="content-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-canvas)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
        }}
      >
        {/* Box Header inside the box */}
        <div style={{ borderBottom: '1px dashed var(--color-hairline)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Experience</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 'var(--spacing-xs) 0 0 0' }}>
            $ cat experience.config.ts
          </p>
        </div>

        {/* Faux Editor */}
        <div
          className="hairline-border"
          style={{
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            overflow: 'hidden',
          }}
        >
          {/* Editor Chrome */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: isDarkMode ? '#252526' : '#f3f3f3',
              borderBottom: `1px solid ${isDarkMode ? '#3c3c3c' : '#e0e0e0'}`,
              fontSize: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ color: 'var(--color-danger)' }}>●</span>
              <span style={{ color: 'var(--color-warning)' }}>●</span>
              <span style={{ color: 'var(--color-success)' }}>●</span>
            </div>
            <div
              style={{
                padding: '2px 12px',
                backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
                color: isDarkMode ? '#cccccc' : '#333333',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                borderTop: `2px solid var(--color-accent)`,
              }}
            >
              experience.config.ts
            </div>
          </div>

          {/* Code Content */}
          <div style={{ overflow: 'auto', maxHeight: '500px' }}>
            <Highlight theme={theme} code={code} language="typescript">
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  style={{
                    ...style,
                    margin: 0,
                    padding: 'var(--spacing-md) 0',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    lineHeight: 1.6,
                    backgroundColor: 'transparent',
                  }}
                >
                  {tokens.map((line, i) => {
                    const lineProps = getLineProps({ line });
                    return (
                      <div
                        key={i}
                        {...lineProps}
                        style={{
                          ...lineProps.style,
                          display: 'flex',
                        }}
                      >
                        {/* Line Number */}
                        <span
                          style={{
                            display: 'inline-block',
                            width: '48px',
                            textAlign: 'right',
                            paddingRight: 'var(--spacing-md)',
                            color: isDarkMode ? '#858585' : '#999999',
                            userSelect: 'none',
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </span>
                        {/* Code Content */}
                        <span style={{ paddingRight: 'var(--spacing-md)' }}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </pre>
              )}
            </Highlight>
          </div>

          {/* Interactive linked project action strip */}
          {visible.some(exp => exp.relatedProjectId) && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: isDarkMode ? '#252526' : '#f3f3f3',
                borderTop: `1px solid ${isDarkMode ? '#3c3c3c' : '#e0e0e0'}`,
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {visible.filter(exp => exp.relatedProjectId).map(exp => (
                <div 
                  key={exp.id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-sm)' 
                  }}
                >
                  <span style={{ color: isDarkMode ? '#cccccc' : '#333333' }}>
                    [!] Linked Project: <strong style={{ color: 'var(--color-accent)' }}>{exp.company} &rarr; VoxGlobal AI</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProjectId(exp.relatedProjectId!);
                      window.dispatchEvent(new CustomEvent('cli-command', { detail: '/projects' }));
                    }}
                    className="button-primary"
                    style={{
                      height: '28px',
                      padding: '0 12px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    Execute: /projects [→]
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
