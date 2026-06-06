import React, { useRef, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { playSynthSound } from '../../utils/audio';
import { CLISuggestionDropdown } from './CLISuggestionDropdown';
import type { TerminalEngineState } from '../../hooks/useTerminalEngine';

interface CLITerminalProps {
  engine: TerminalEngineState;
}

export const CLITerminal: React.FC<CLITerminalProps> = ({ engine }) => {
  const { identity, isSoundEnabled, isDarkMode } = usePortfolio();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSynthSound('click', isSoundEnabled);
    engine.handleSubmit();
  };
  const hasSections = engine.visibleSections.length > 0;

  return (
    <section
      id="cli-hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: hasSections ? 'auto' : 'calc(100vh - 56px)',
        backgroundColor: 'transparent',
        color: isDarkMode ? 'var(--color-on-dark)' : 'var(--color-ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: hasSections ? '80px var(--spacing-xl) 24px var(--spacing-xl)' : '64px var(--spacing-xl)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* TUI Terminal Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          border: isDarkMode
            ? '1px solid var(--color-hairline-strong)'
            : '1px solid var(--color-hairline)',
          borderRadius: 'var(--rounded-none)',
          backgroundColor: isDarkMode
            ? 'rgba(15, 0, 0, 0.85)'
            : 'rgba(243, 240, 240, 0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDarkMode ? 'none' : '0 10px 30px rgba(15, 0, 0, 0.05)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
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
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ color: 'var(--color-danger)' }}>●</span>
            <span style={{ color: 'var(--color-warning)' }}>●</span>
            <span style={{ color: 'var(--color-success)' }}>●</span>
          </div>
          <div>
            {identity.avatar.initials.toLowerCase()}@session: ~ (active)
          </div>
          <div>v2.0_tty1</div>
        </div>

        {/* Terminal Body */}
        <div
          style={{
            padding: 'var(--spacing-xxl) var(--spacing-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xl)',
          }}
        >
          {/* CLI Prompt and Identity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                color: isDarkMode ? 'var(--color-on-dark-mute)' : 'var(--color-mute)',
                fontSize: '0.875rem',
              }}
            >
              <span>$</span>
              <span>cat identity.json</span>
            </div>

            <h1
              className="display-xl"
              style={{
                margin: 0,
                letterSpacing: '-0.5px',
                color: isDarkMode ? 'var(--color-on-dark)' : 'var(--color-ink)',
              }}
            >
              {identity.fullName.toUpperCase()}
            </h1>

            <p
              style={{
                color: isDarkMode ? 'var(--color-on-dark-mute)' : 'var(--color-mute)',
                margin: 0,
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              {`// ${identity.title.toUpperCase()}`}
            </p>
          </div>

          {/* Interactive Input with Suggestion Dropdown ABOVE */}
          <div style={{ position: 'relative' }}>
            <CLISuggestionDropdown
              suggestions={engine.suggestions}
              selectedIndex={engine.selectedSuggestionIndex}
              onSelect={(cmd) => {
                engine.setInput(cmd);
                inputRef.current?.focus();
              }}
              isDarkMode={isDarkMode}
            />

            <form
              onSubmit={handleFormSubmit}
              className="tui-prompt-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                minHeight: '44px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: isDarkMode
                  ? 'var(--color-surface-dark-elevated)'
                  : 'rgba(253, 252, 252, 1.0)',
                color: isDarkMode ? 'var(--color-on-dark)' : 'var(--color-ink)',
                transition: 'background-color 0.3s ease',
              }}
            >
              <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
                &gt;
              </span>
              <input
                ref={inputRef}
                type="text"
                value={engine.input}
                onChange={(e) => engine.setInput(e.target.value)}
                onKeyDown={engine.handleKeyDown}
                placeholder="Type /help to start exploring..."
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'inherit',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.925rem',
                  lineHeight: '1.4',
                  caretColor: 'var(--color-accent)',
                }}
              />
            </form>
          </div>

          {/* Help Output */}
          {engine.helpShown && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-xs)',
                paddingTop: 'var(--spacing-md)',
                borderTop: isDarkMode
                  ? '1px dashed var(--color-hairline-strong)'
                  : '1px dashed var(--color-hairline)',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  color: isDarkMode ? 'var(--color-on-dark-mute)' : 'var(--color-stone)',
                  fontWeight: 700,
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                AVAILABLE_COMMANDS //
              </div>
              {engine.commands.map((cmd) => (
                <div
                  key={cmd.name}
                  style={{
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    fontSize: '0.8125rem',
                    padding: '2px 0',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    engine.setInput(cmd.name);
                    inputRef.current?.focus();
                  }}
                >
                  <span
                    style={{
                      color: 'var(--color-accent)',
                      fontWeight: 500,
                      minWidth: '150px',
                    }}
                  >
                    {cmd.name}
                  </span>
                  <span
                    style={{
                      color: isDarkMode
                        ? 'var(--color-on-dark-mute)'
                        : 'var(--color-mute)',
                    }}
                  >
                    {cmd.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Terminal Footer Panel */}
        <div
          style={{
            borderTop: isDarkMode
              ? '1px solid var(--color-hairline-strong)'
              : '1px solid var(--color-hairline)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: isDarkMode ? 'var(--color-on-dark-mute)' : 'var(--color-mute)',
          }}
        >
          <div>type /help to explore ↓</div>
          <div style={{ letterSpacing: '0.5px' }}>SYSTEM READY_</div>
        </div>
      </div>

      <style>{`
        .blinking-cursor {
          animation: blink 1s step-end infinite;
          color: var(--color-accent);
          font-weight: bold;
        }
        @keyframes blink {
          from, to { opacity: 0 }
          50% { opacity: 1 }
        }
      `}</style>
    </section>
  );
};
