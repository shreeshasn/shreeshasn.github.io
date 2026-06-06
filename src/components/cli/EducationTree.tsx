import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { playSynthSound } from '../../utils/audio';

export const EducationTree: React.FC = () => {
  const { education, isSoundEnabled } = usePortfolio();
  const [expandedIds, setExpandedIds] = useState<string[]>(['degree', 'pu_college', 'high_school']); // expanded by default

  const visible = education.filter((e) => !e.hideFromPublic);

  // Sort by tier: degree first, then pu_college, then high_school
  const tierOrder: Record<string, number> = { degree: 0, pu_college: 1, high_school: 2 };
  const sorted = [...visible].sort((a, b) => (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99));

  const degree = sorted.find((e) => e.tier === 'degree');
  const pu = sorted.find((e) => e.tier === 'pu_college');
  const school = sorted.find((e) => e.tier === 'high_school');

  const toggleExpand = (id: string) => {
    playSynthSound('tick', isSoundEnabled);
    const isExpanding = !expandedIds.includes(id);

    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

    if (isExpanding) {
      setTimeout(() => {
        const element = document.getElementById(`folder-block-${id}`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }, 100);
    }
  };

  const getFields = (edu: typeof sorted[0]) => {
    const fields = [
      { key: 'institution', value: edu.institution },
      ...(edu.degree ? [{ key: 'degree', value: `${edu.degree} — ${edu.field}` }] : [{ key: 'field', value: edu.field }]),
      { key: 'location', value: edu.location },
      { key: 'grade', value: edu.grade },
      { key: 'duration', value: `${edu.startDate} → ${edu.endDate}` },
    ];
    if (edu.highlights.length > 0) {
      fields.push({ key: 'highlights', value: edu.highlights.join(', ') });
    }
    return fields;
  };

  return (
    <section className="content-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-canvas)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Box Header inside the box */}
        <div style={{ borderBottom: '1px dashed var(--color-hairline)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Education</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 'var(--spacing-xs) 0 0 0' }}>
            $ tree /education
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem', lineHeight: 1.6 }}>
          
          {/* 1. DEGREE COLLEGE */}
          {degree && (
            <div id={`folder-block-${degree.id}`} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Folder Line */}
              <div
                onClick={() => toggleExpand(degree.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer', padding: '4px 0' }}
              >
                <span>{expandedIds.includes(degree.id) ? '📂' : '📁'}</span>
                <span style={{ fontWeight: 700, color: 'var(--color-ink)' }}>Degree College/</span>
              </div>

              {/* Expanded block */}
              <AnimatePresence>
                {expandedIds.includes(degree.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {/* Fields */}
                    {getFields(degree).map((f) => (
                      <div key={f.key} style={{ display: 'flex', gap: 'var(--spacing-xs)', padding: '2px 0' }}>
                        <span style={{ color: 'var(--color-stone)', whiteSpace: 'pre' }}>├── </span>
                        <span style={{ color: 'var(--color-mute)' }}>{f.key}:</span>
                        <span style={{ color: 'var(--color-ink)' }}>"{f.value}"</span>
                      </div>
                    ))}

                    {/* Nested PU College Folder */}
                    {pu && (
                      <div id={`folder-block-${pu.id}`} style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Folder Line */}
                        <div
                          onClick={() => toggleExpand(pu.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer', padding: '4px 0' }}
                        >
                          <span style={{ color: 'var(--color-stone)', whiteSpace: 'pre' }}>└── </span>
                          <span>{expandedIds.includes(pu.id) ? '📂' : '📁'}</span>
                          <span style={{ fontWeight: 700, color: 'var(--color-ink)' }}>PU College/</span>
                        </div>

                        {/* Expanded block */}
                        {expandedIds.includes(pu.id) && (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {/* Fields of PU */}
                            {getFields(pu).map((f) => (
                              <div key={f.key} style={{ display: 'flex', gap: 'var(--spacing-xs)', padding: '2px 0' }}>
                                <span style={{ color: 'var(--color-stone)', whiteSpace: 'pre' }}>│   ├── </span>
                                <span style={{ color: 'var(--color-mute)' }}>{f.key}:</span>
                                <span style={{ color: 'var(--color-ink)' }}>"{f.value}"</span>
                              </div>
                            ))}

                            {/* Nested High School Folder */}
                            {school && (
                              <div id={`folder-block-${school.id}`} style={{ display: 'flex', flexDirection: 'column' }}>
                                {/* Folder Line */}
                                <div
                                  onClick={() => toggleExpand(school.id)}
                                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer', padding: '4px 0' }}
                                >
                                  <span style={{ color: 'var(--color-stone)', whiteSpace: 'pre' }}>│   └── </span>
                                  <span>{expandedIds.includes(school.id) ? '📂' : '📁'}</span>
                                  <span style={{ fontWeight: 700, color: 'var(--color-ink)' }}>High School/</span>
                                </div>

                                {/* Expanded block */}
                                {expandedIds.includes(school.id) && (
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {/* Fields of High School */}
                                    {getFields(school).map((f, idx, arr) => {
                                      const isLastField = idx === arr.length - 1;
                                      return (
                                        <div key={f.key} style={{ display: 'flex', gap: 'var(--spacing-xs)', padding: '2px 0' }}>
                                          <span style={{ color: 'var(--color-stone)', whiteSpace: 'pre' }}>
                                            {isLastField ? '│       └── ' : '│       ├── '}
                                          </span>
                                          <span style={{ color: 'var(--color-mute)' }}>{f.key}:</span>
                                          <span style={{ color: 'var(--color-ink)' }}>"{f.value}"</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
