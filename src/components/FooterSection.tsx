import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { playSynthSound } from '../utils/audio';

export const FooterSection: React.FC = () => {
  const { identity, social, isSoundEnabled } = usePortfolio();

  const handleBackToTop = () => {
    playSynthSound('click', isSoundEnabled);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer 
      style={{
        marginTop: 'var(--spacing-section)',
        borderTop: '1px solid var(--color-hairline)',
        backgroundColor: 'var(--color-canvas)',
        width: '100%',
        fontFamily: 'var(--font-mono)'
      }}
    >
      <div className="content-container">
        
        {/* Top Segment: Social Channel Grid */}
        <div 
          className="social-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderBottom: '1px solid var(--color-hairline)'
          }}
        >
          {Object.entries(social).map(([key, item]) => {
            if (!item.public) return null;
            return (
              <a
                key={key}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="transition-all-300"
                style={{
                  padding: 'var(--spacing-md) var(--spacing-sm)',
                  textAlign: 'center',
                  color: 'var(--color-body)',
                  fontSize: '0.8125rem',
                  textDecoration: 'none',
                  borderRight: key !== 'codepen' ? '1px solid var(--color-hairline)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-xs)'
                }}
                onClick={() => playSynthSound('click', isSoundEnabled)}
              >
                <span>[ {item.displayName.toUpperCase()} ]</span>
              </a>
            );
          })}
        </div>

        {/* Bottom Segment: Copyright & Back to Top */}
        <div 
          style={{
            padding: 'var(--spacing-xl) 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)'
          }}
        >
          <div className="caption-md" style={{ color: 'var(--color-mute)' }}>
            © {new Date().getFullYear()} {identity.fullName.toUpperCase()}. ALL SYSTEMS ACTIVE.
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
            <span 
              onClick={handleBackToTop}
              className="caption-md hover-reveal"
              style={{ cursor: 'pointer', color: 'var(--color-mute)', fontWeight: 500 }}
            >
              [↑] back-to-top
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .social-footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .social-footer-grid a {
            border-bottom: 1px solid var(--color-hairline);
          }
          .social-footer-grid a:nth-child(2) {
            border-right: none !important;
          }
          .social-footer-grid a:nth-child(4) {
            border-right: none !important;
            border-bottom: none !important;
          }
          .social-footer-grid a:nth-child(3) {
            border-bottom: none !important;
          }
        }
      `}</style>
    </footer>
  );
};
