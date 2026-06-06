import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { playSynthSound } from '../../utils/audio';

export const CLIFooter: React.FC = () => {
  const { identity, social, isSoundEnabled } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show footer when cursor is near the bottom edge AND we are scrolled to the bottom (if scrollable)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const bottomThreshold = window.innerHeight - 60;
      const nearBottom = e.clientY >= bottomThreshold;
      
      if (nearBottom || isHovered) {
        // Calculate scroll bounds on the fly to support dynamic folder expansions
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const isScrollable = scrollHeight > clientHeight + 40;

        // Enabled if page is not scrollable, or if we have scrolled to the absolute bottom (with 50px buffer)
        const isAtBottom = !isScrollable || (window.innerHeight + window.scrollY >= scrollHeight - 50);

        if (isAtBottom || isHovered) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  return (
    <footer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'var(--color-canvas)',
        borderTop: '1px solid var(--color-hairline)',
        zIndex: 100,
        fontFamily: 'var(--font-mono)',
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: 'var(--spacing-md) var(--spacing-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--spacing-sm)',
        }}
      >
        {/* Social Links */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          {Object.entries(social).map(([key, item]) => {
            if (!item.public) return null;
            return (
              <a
                key={key}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'var(--color-mute)',
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                }}
                onClick={() => playSynthSound('click', isSoundEnabled)}
              >
                [ {item.displayName.toUpperCase()} ]
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="caption-md" style={{ color: 'var(--color-mute)' }}>
          © {new Date().getFullYear()} {identity.fullName.toUpperCase()}
        </div>
      </div>
    </footer>
  );
};
