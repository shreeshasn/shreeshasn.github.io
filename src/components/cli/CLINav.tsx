import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { playSynthSound } from '../../utils/audio';

export const CLINav: React.FC = () => {
  const { identity, featureFlags, isDarkMode, toggleDarkMode, isSoundEnabled, toggleSound, cliQuotes } = usePortfolio();
  const navigate = useNavigate();

  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Random CLI quote — stable per mount, changes on hover
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * cliQuotes.length));
  const quote = useMemo(() => cliQuotes[quoteIndex] || '', [cliQuotes, quoteIndex]);

  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % cliQuotes.length);
  };

  // Auto-hide: show on top-edge hover
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 60 || isHovered) {
        setIsNavVisible(true);
      } else {
        setIsNavVisible(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const handleToggleDarkMode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playSynthSound('click', isSoundEnabled);
    toggleDarkMode();
  };

  const handleToggleSound = () => {
    toggleSound();
    setTimeout(() => playSynthSound('click', !isSoundEnabled), 50);
  };

  const handleSwitchToUI = () => {
    playSynthSound('click', isSoundEnabled);
    navigate('/explore/ui');
  };

  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '56px',
        backgroundColor: 'var(--color-canvas)',
        borderBottom: '1px solid var(--color-hairline)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--spacing-xl)',
        fontFamily: 'var(--font-mono)',
        transform: isNavVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
      }}
    >
      {/* Logo */}
      <div
        style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--color-ink)', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span>[ </span>
        <span style={{ letterSpacing: isLogoHovered ? '1px' : '0.5px', transition: 'all 0.2s ease', color: isLogoHovered ? 'var(--color-accent)' : 'inherit' }}>
          {isLogoHovered ? identity.fullName.toUpperCase() : `${identity.avatar.initials}.SYS`}
        </span>
        <span> ]</span>
      </div>

      {/* Center: Rotating CLI Quote (desktop only) */}
      <div
        className="cli-nav-quote"
        onClick={rotateQuote}
        style={{
          display: 'none',
          flex: 1,
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--color-stone)',
          fontSize: '0.75rem',
          fontStyle: 'italic',
          padding: '0 var(--spacing-xl)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
        title="Click for another quote"
      >
        "{quote}"
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        {/* Switch to UI */}
        <button
          onClick={handleSwitchToUI}
          style={{
            background: 'none',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--rounded-sm)',
            cursor: 'pointer',
            color: 'var(--color-ink)',
            fontSize: '0.75rem',
            padding: '4px 12px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          [ UI ]
        </button>

        {featureFlags.enableSound && (
          <button onClick={handleToggleSound} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSoundEnabled ? 'var(--color-ink)' : 'var(--color-ash)', fontSize: '0.875rem', padding: '4px', fontFamily: 'var(--font-mono)' }} title={isSoundEnabled ? 'Mute' : 'Unmute'}>
            {isSoundEnabled ? '[ ♪ ]' : '[ ♪̸ ]'}
          </button>
        )}

        {featureFlags.enableDarkMode && (
          <button type="button" onClick={handleToggleDarkMode} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink)', fontSize: '0.875rem', padding: '4px', fontFamily: 'var(--font-mono)' }} title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
            {isDarkMode ? '[ ☀ ]' : '[ ☾ ]'}
          </button>
        )}
      </div>

      <style>{`
        @media (min-width: 769px) {
          .cli-nav-quote { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};
