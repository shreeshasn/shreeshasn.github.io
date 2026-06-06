import React from 'react';
import type { CommandDefinition } from '../../hooks/useTerminalEngine';

interface CLISuggestionDropdownProps {
  suggestions: CommandDefinition[];
  selectedIndex: number;
  onSelect: (command: string) => void;
  isDarkMode: boolean;
}

export const CLISuggestionDropdown: React.FC<CLISuggestionDropdownProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  isDarkMode,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current || selectedIndex < 0) return;
    const container = containerRef.current;
    const activeItem = container.children[selectedIndex] as HTMLElement;
    if (!activeItem) return;

    // Scroll active item into view if it is out of the container viewport
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;
    const itemTop = activeItem.offsetTop;
    const itemBottom = itemTop + activeItem.clientHeight;

    if (itemTop < containerTop) {
      container.scrollTop = itemTop;
    } else if (itemBottom > containerBottom) {
      container.scrollTop = itemBottom - container.clientHeight;
    }
  }, [selectedIndex]);

  if (suggestions.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        width: 'fit-content',
        minWidth: '320px',
        maxWidth: '100%',
        marginBottom: '4px',
        backgroundColor: isDarkMode ? 'rgba(15, 0, 0, 0.95)' : 'rgba(243, 240, 240, 0.98)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${isDarkMode ? 'var(--color-hairline-strong)' : 'var(--color-hairline)'}`,
        borderRadius: 'var(--rounded-none)',
        overflow: 'hidden',
        zIndex: 20,
        maxHeight: '160px',
        overflowY: 'auto',
        boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(15, 0, 0, 0.08)',
      }}
    >
      {suggestions.map((cmd, i) => {
        const isSelected = i === selectedIndex;
        return (
          <div
            key={cmd.name}
            onClick={() => onSelect(cmd.name)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              cursor: 'pointer',
              display: 'flex',
              gap: 'var(--spacing-md)',
              alignItems: 'center',
              backgroundColor: isSelected
                ? isDarkMode
                  ? 'var(--color-surface-soft)'
                  : 'var(--color-surface-card)'
                : 'transparent',
              borderLeft: isSelected
                ? '3px solid var(--color-accent)'
                : '3px solid transparent',
              paddingLeft: isSelected
                ? 'calc(var(--spacing-md) - 3px)'
                : 'var(--spacing-md)',
              transition: 'background-color 0.15s ease, border-left-color 0.15s ease',
            }}
          >
            <span
              style={{
                color: 'var(--color-accent)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                minWidth: '120px',
              }}
            >
              {cmd.name}
            </span>
            <span
              style={{
                color: isDarkMode ? 'var(--color-on-dark-mute)' : 'var(--color-mute)',
                fontSize: '0.75rem',
              }}
            >
              {cmd.description}
            </span>
          </div>
        );
      })}
    </div>
  );
};
