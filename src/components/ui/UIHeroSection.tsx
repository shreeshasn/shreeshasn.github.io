import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { highlightKeywords } from '../../utils/text';

export const UIHeroSection: React.FC = () => {
  const { identity, bio, isDarkMode, meta } = usePortfolio();

  return (
    <section
      id="about"
      className="content-container"
      style={{
        borderBottom: '1px solid var(--color-hairline)',
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'var(--spacing-xl)',
        paddingBottom: 'var(--spacing-xl)',
      }}
    >
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-canvas)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
          width: '100%',
        }}
      >
        {/* Name & Title */}
        <div>
          <h1
            className="display-xl"
            style={{
              margin: 0,
              color: isDarkMode ? 'var(--color-on-dark)' : 'var(--color-ink)',
              letterSpacing: '-0.5px',
            }}
          >
            {identity.fullName.toUpperCase()}
          </h1>
          <p
            style={{
              margin: 'var(--spacing-xs) 0 0 0',
              fontSize: '1rem',
              fontWeight: 500,
              color: isDarkMode ? 'var(--color-on-dark-mute)' : 'var(--color-mute)',
            }}
          >
            {`// ${identity.title.toUpperCase()}`}
          </p>
        </div>

        {/* Bio */}
        <p className="body-md" style={{ color: 'var(--color-body)', margin: 0, lineHeight: 1.7 }}>
          {highlightKeywords(bio.longBio, meta.highlightKeywords || [])}
        </p>


        {/* Narrative Journey Grid (Commented Out)
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <h3
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-stone)',
              fontWeight: 700,
              letterSpacing: '1px',
              margin: 0,
            }}
          >
            NARRATIVE_JOURNEY //
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--spacing-md)',
            }}
          >
            {Object.entries(bio.narrative).map(([key, phase]) => (
              <div
                key={key}
                className="hairline-border"
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-xs)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                    {phase.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>
                    {phase.duration}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', margin: 0, color: 'var(--color-body)', lineHeight: 1.4 }}>
                  {phase.description}
                </p>
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 'var(--spacing-xs)',
                    borderTop: '1px dashed var(--color-hairline)',
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                    color: 'var(--color-mute)',
                    lineHeight: 1.3,
                  }}
                >
                  "{phase.keyMoment}"
                </div>
              </div>
            ))}
          </div>
        </div>
        */}

        {/* Technical Directives & Core Pillars (Commented Out)
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <h3
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-stone)',
              fontWeight: 700,
              letterSpacing: '1px',
              margin: 0,
            }}
          >
            TECHNICAL_DIRECTIVES //
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--spacing-md)',
            }}
          >
            <div
              className="hairline-border"
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-xs)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                01 / PERFORMANCE FIRST
              </span>
              <p style={{ fontSize: '0.8125rem', margin: 0, color: 'var(--color-body)', lineHeight: 1.4 }}>
                Crafting optimized WebGL components, fluid force simulations, and reactive interfaces at a stable, lag-free 60fps.
              </p>
            </div>
            <div
              className="hairline-border"
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-xs)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                02 / AESTHETIC INTEGRITY
              </span>
              <p style={{ fontSize: '0.8125rem', margin: 0, color: 'var(--color-body)', lineHeight: 1.4 }}>
                Adhering strictly to monochrome Brutalist styling constraints, fluid layouts, and rich audio-visual micro-interactions.
              </p>
            </div>
            <div
              className="hairline-border"
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-xs)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                03 / SYSTEM SYNERGY
              </span>
              <p style={{ fontSize: '0.8125rem', margin: 0, color: 'var(--color-body)', lineHeight: 1.4 }}>
                Fusing visual frontends with solid backend engineering, clean data architectures, and automated agent environments.
              </p>
            </div>
          </div>
        </div>
        */}

        {/* Core Philosophy & Aspirations */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-xl)',
            paddingTop: 'var(--spacing-md)',
            borderTop: '1px dashed var(--color-hairline)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>[PHILOSOPHY]</span>
            <p
              style={{
                fontSize: '0.875rem',
                margin: 'var(--spacing-xs) 0 0 0',
                fontStyle: 'italic',
                color: 'var(--color-ink)',
                lineHeight: 1.5,
              }}
            >
              "{bio.philosophy}"
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>[FUTURE ASPIRATION]</span>
            <p
              style={{
                fontSize: '0.875rem',
                margin: 'var(--spacing-xs) 0 0 0',
                color: 'var(--color-ink)',
                lineHeight: 1.5,
              }}
            >
              {bio.futureAspiration}
            </p>
          </div>
        </div>

        {/* Meta Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-xl)',
            paddingTop: 'var(--spacing-md)',
            borderTop: '1px dashed var(--color-hairline)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>[LOCATION]</div>
            <div style={{ fontSize: '0.875rem', marginTop: '2px', color: 'var(--color-ink)' }}>
              {identity.location.city}, {identity.location.country}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>[STATUS]</div>
            <div style={{ fontSize: '0.875rem', marginTop: '2px', color: 'var(--color-ink)' }}>
              {identity.status}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>[FOCUS]</div>
            <div style={{ fontSize: '0.875rem', marginTop: '2px', color: 'var(--color-ink)' }}>
              {bio.currentFocus}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
