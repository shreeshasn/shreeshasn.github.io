import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { playSynthSound } from '../../utils/audio';

export const UINav: React.FC = () => {
  const { identity, featureFlags, isDarkMode, toggleDarkMode, isSoundEnabled, toggleSound } = usePortfolio();
  const navigate = useNavigate();
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (targetId: string) => {
    playSynthSound('click', isSoundEnabled);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const navHeight = 56;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - navHeight, behavior: 'smooth' });
    }
  };

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

  const handleSwitchToCLI = () => {
    playSynthSound('click', isSoundEnabled);
    navigate('/explore/cli');
  };

  const sections = [
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav
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
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Logo */}
      <div
        style={{
          cursor: 'pointer',
          fontWeight: 700,
          color: 'var(--color-ink)',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
        }}
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
        onClick={() => handleNavClick('about')}
      >
        <span>[ </span>
        <span
          style={{
            letterSpacing: isLogoHovered ? '1px' : '0.5px',
            transition: 'all 0.2s ease',
            color: isLogoHovered ? 'var(--color-accent)' : 'inherit',
          }}
        >
          {isLogoHovered ? identity.fullName.toUpperCase() : `${identity.avatar.initials}.SYS`}
        </span>
        <span> ]</span>
      </div>

      {/* Desktop Links */}
      <div className="ui-desktop-links" style={{ display: 'none', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
        {sections.map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 && <span style={{ color: 'var(--color-stone)' }}>·</span>}
            <span
              onClick={() => handleNavClick(s.id)}
              className="hover-reveal"
              style={{ cursor: 'pointer', color: 'var(--color-ink)', fontSize: '0.875rem' }}
            >
              {s.label}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        {/* Switch to CLI */}
        <button
          onClick={handleSwitchToCLI}
          className="ui-desktop-switch"
          style={{
            display: 'none',
            background: 'none',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--rounded-sm)',
            cursor: 'pointer',
            color: 'var(--color-ink)',
            fontSize: '0.75rem',
            padding: '4px 12px',
            fontFamily: 'var(--font-mono)',
            alignItems: 'center',
          }}
        >
          [ CLI ]
        </button>

        {featureFlags.enableSound && (
          <button
            onClick={handleToggleSound}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSoundEnabled ? 'var(--color-ink)' : 'var(--color-ash)', fontSize: '0.875rem', padding: '4px', fontFamily: 'var(--font-mono)' }}
            title={isSoundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {isSoundEnabled ? '[ ♪ ]' : '[ ♪̸ ]'}
          </button>
        )}

        {featureFlags.enableDarkMode && (
          <button
            type="button"
            onClick={handleToggleDarkMode}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink)', fontSize: '0.875rem', padding: '4px', fontFamily: 'var(--font-mono)' }}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? '[ ☀ ]' : '[ ☾ ]'}
          </button>
        )}

        {/* Mobile Hamburger */}
        <button
          onClick={() => { playSynthSound('click', isSoundEnabled); setIsMobileMenuOpen(!isMobileMenuOpen); }}
          className="ui-mobile-hamburger"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink)', fontSize: '1rem', padding: '4px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center' }}
        >
          {isMobileMenuOpen ? '[×]' : '[=]'}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '56px',
            left: 0,
            width: '100%',
            height: 'calc(100vh - 56px)',
            backgroundColor: 'var(--color-canvas)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-xl)',
            padding: 'var(--spacing-xxl)',
          }}
        >
          {sections.map((s) => (
            <span
              key={s.id}
              onClick={() => handleNavClick(s.id)}
              style={{ cursor: 'pointer', color: 'var(--color-ink)', fontSize: '1.25rem', fontWeight: 500 }}
            >
              [+] {s.label}
            </span>
          ))}
          <button onClick={handleSwitchToCLI} className="button-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
            Switch to CLI [→]
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .ui-desktop-links { display: flex !important; }
          .ui-desktop-switch { display: inline-flex !important; }
          .ui-mobile-hamburger { display: none !important; }
        }
      `}</style>
    </nav>
  );
};
