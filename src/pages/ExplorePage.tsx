import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { playSynthSound } from '../utils/audio';

const BOOT_MESSAGES = [
  { prefix: '[OK]', text: 'Neural subsystem initialized' },
  { prefix: '[OK]', text: 'Portfolio kernel v2.0 loaded' },
  { prefix: '[OK]', text: 'Creative engine: ONLINE' },
  { prefix: '[OK]', text: 'All systems nominal — ready for exploration' },
];

const BOOT_DELAY = 800; // ms between each message

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { isSoundEnabled, isDarkMode, toggleDarkMode, featureFlags } = usePortfolio();
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [bootComplete, setBootComplete] = useState(false);
  // Boot sequence — stagger messages
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleMessages(count);
      if (count >= BOOT_MESSAGES.length) {
        clearInterval(interval);
        // Short pause before showing buttons
        setTimeout(() => setBootComplete(true), 600);
      }
    }, BOOT_DELAY);

    return () => clearInterval(interval);
  }, []);

  const handleModeSelect = (mode: 'ui' | 'cli') => {
    playSynthSound('click', isSoundEnabled);
    navigate(`/explore/${mode}`);
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-xl)',
        backgroundColor: 'transparent',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Top-Right Theme Toggle */}
      {featureFlags.enableDarkMode && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            playSynthSound('click', isSoundEnabled);
            toggleDarkMode();
          }}
          style={{
            position: 'absolute',
            top: 'var(--spacing-xl)',
            right: 'var(--spacing-xl)',
            backgroundColor: isDarkMode ? 'var(--color-canvas)' : '#f5f3f3',
            border: `1px solid ${isDarkMode ? 'var(--color-hairline-strong)' : 'var(--color-hairline)'}`,
            borderRadius: 'var(--rounded-none)',
            cursor: 'pointer',
            color: isDarkMode ? 'var(--color-on-dark)' : 'var(--color-ink)',
            fontSize: '0.875rem',
            padding: '8px 16px',
            fontFamily: 'var(--font-mono)',
            zIndex: 100,
            boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(15, 0, 0, 0.05)',
            transition: 'all 0.25s ease',
          }}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? '[ ☀ LIGHT ]' : '[ ☾ DARK ]'}
        </button>
      )}

      {/* Boot Messages Terminal Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          border: isDarkMode
            ? '1px solid var(--color-hairline-strong)'
            : '1px solid var(--color-hairline)',
          borderRadius: 'var(--rounded-none)',
          backgroundColor: isDarkMode ? 'var(--color-canvas)' : '#f5f3f3',
          marginBottom: bootComplete ? 'var(--spacing-xl)' : '0',
          transition: 'margin-bottom 0.4s ease, border-color 0.3s ease, background-color 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDarkMode ? 'none' : '0 10px 35px rgba(15, 0, 0, 0.05)',
          zIndex: 10,
        }}
      >
        {/* Terminal Window Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderBottom: isDarkMode
              ? '1px solid var(--color-hairline-strong)'
              : '1px solid var(--color-hairline)',
            fontSize: '0.75rem',
            color: isDarkMode ? 'var(--color-on-dark-mute)' : 'var(--color-mute)',
            userSelect: 'none',
            backgroundColor: isDarkMode ? 'var(--color-surface-soft)' : 'var(--color-surface-soft)',
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ color: 'var(--color-danger)' }}>●</span>
            <span style={{ color: 'var(--color-warning)' }}>●</span>
            <span style={{ color: 'var(--color-success)' }}>●</span>
          </div>
          <div style={{ fontWeight: 500 }}>kernel-boot.log</div>
          <div>tty0</div>
        </div>

        {/* Boot Messages Body */}
        <div
          style={{
            padding: 'var(--spacing-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}
        >
          {BOOT_MESSAGES.map((msg, i) => (
            <AnimatePresence key={i}>
              {i < visibleMessages && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                    {msg.prefix}
                  </span>
                  <span style={{ color: isDarkMode ? 'var(--color-on-dark)' : 'var(--color-ink)' }}>
                    {msg.text}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      {/* Mode Selector Buttons */}
      <AnimatePresence>
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 'var(--spacing-xl)',
              flexWrap: 'wrap',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '600px',
              zIndex: 10,
            }}
          >
            <ModeButton
              label="[ UI MODE ]"
              subtitle="For humans who prefer buttons"
              onClick={() => handleModeSelect('ui')}
              isDarkMode={isDarkMode}
            />
            <ModeButton
              label="[ CLI MODE ]"
              subtitle="For humans who prefer commands"
              onClick={() => handleModeSelect('cli')}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ─── Mode Button with typing subtitle ────────────────────────────────

interface ModeButtonProps {
  label: string;
  subtitle: string;
  onClick: () => void;
  isDarkMode: boolean;
}

const ModeButton: React.FC<ModeButtonProps> = ({ label, subtitle, onClick, isDarkMode }) => {
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  // One-time typing animation for subtitle
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < subtitle.length) {
        setTypedSubtitle(subtitle.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [subtitle]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-xxl) var(--spacing-xl)',
        width: '280px',
        backgroundColor: isHovered
          ? (isDarkMode ? 'var(--color-surface-dark-elevated)' : 'var(--color-surface-card)')
          : (isDarkMode ? 'var(--color-canvas)' : '#f5f3f3'),
        color: isDarkMode ? 'var(--color-on-dark)' : 'var(--color-ink)',
        border: `1px solid ${isDarkMode ? 'var(--color-hairline-strong)' : 'var(--color-hairline)'}`,
        borderRadius: 'var(--rounded-none)',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        transition: 'all 0.25s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <span
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '1px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '0.75rem',
          color: isDarkMode ? 'var(--color-on-dark-mute)' : 'var(--color-mute)',
          minHeight: '1.2em',
        }}
      >
        {typedSubtitle}
        <span
          style={{
            animation: 'blink 1s step-end infinite',
            color: 'var(--color-accent)',
            fontWeight: 'bold',
            marginLeft: '1px',
          }}
        >
          _
        </span>
      </span>
    </button>
  );
};
