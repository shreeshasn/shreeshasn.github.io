import { useState, useCallback, useMemo, useEffect } from 'react';

export interface CommandDefinition {
  name: string;
  description: string;
}

const COMMANDS: CommandDefinition[] = [
  { name: '/help', description: 'List all available commands' },
  { name: '/about', description: 'Display identity and role information' },
  { name: '/summary', description: 'Show professional summary' },
  { name: '/education', description: 'Browse education as a folder tree' },
  { name: '/experience', description: 'View work experience as code' },
  { name: '/skills', description: 'Interactive skill graph visualization' },
  { name: '/projects', description: '3D holographic project showcase' },
  { name: '/achievements', description: 'Unlocked achievement wall' },
  { name: '/certifications', description: 'Verified credential badges' },
  { name: '/extracurricular', description: 'Activity commit log' },
  { name: '/resume', description: 'Download resume document' },
  { name: '/contact', description: 'Contact information and social links' },
  { name: '/clear', description: 'Clear all rendered sections' },
];

export interface TerminalEngineState {
  input: string;
  setInput: (value: string) => void;
  suggestions: CommandDefinition[];
  selectedSuggestionIndex: number;
  visibleSections: string[];
  helpShown: boolean;
  commandHistory: string[];
  historyIndex: number;
  handleSubmit: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  commands: CommandDefinition[];
}

export function useTerminalEngine(): TerminalEngineState {
  const [input, setInput] = useState('');
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [helpShown, setHelpShown] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Filter suggestions based on current input, memoized to keep dependency stable
  const suggestions = useMemo<CommandDefinition[]>(() => {
    return input.startsWith('/')
      ? COMMANDS.filter(
          (cmd) =>
            cmd.name.startsWith(input.toLowerCase()) && cmd.name !== input.toLowerCase()
        )
      : [];
  }, [input]);

  const executeCommand = useCallback((cmd: string) => {
    const normalizedCmd = cmd.trim().toLowerCase();

    if (normalizedCmd === '/help') {
      setHelpShown(true);
    } else if (normalizedCmd === '/clear') {
      setVisibleSections([]);
      setHelpShown(false);
    } else {
      // Check if this is a valid section command
      const validSections = COMMANDS
        .filter((c) => c.name !== '/help' && c.name !== '/clear')
        .map((c) => c.name.slice(1)); // Remove the '/'

      const sectionName = normalizedCmd.slice(1); // Remove '/'
      if (validSections.includes(sectionName)) {
        setVisibleSections([sectionName]);
        setHelpShown(false);
      }
    }

    // Add to command history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');
    setSelectedSuggestionIndex(-1);
  }, []);

  useEffect(() => {
    const handleCliCommand = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        executeCommand(customEvent.detail);
      }
    };
    window.addEventListener('cli-command', handleCliCommand);
    return () => window.removeEventListener('cli-command', handleCliCommand);
  }, [executeCommand]);


  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    executeCommand(trimmed);
  }, [input, executeCommand]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        // Tab-complete the first matching suggestion
        if (suggestions.length > 0) {
          const idx = selectedSuggestionIndex >= 0 ? selectedSuggestionIndex : 0;
          setInput(suggestions[idx].name);
          setSelectedSuggestionIndex(-1);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (suggestions.length > 0) {
          // Navigate suggestions
          setSelectedSuggestionIndex((prev) =>
            prev <= 0 ? suggestions.length - 1 : prev - 1
          );
        } else if (commandHistory.length > 0) {
          // Navigate command history
          const newIndex =
            historyIndex === -1
              ? commandHistory.length - 1
              : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (suggestions.length > 0) {
          setSelectedSuggestionIndex((prev) =>
            prev >= suggestions.length - 1 ? 0 : prev + 1
          );
        } else if (historyIndex >= 0) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setInput('');
          } else {
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
          }
        }
      } else if (e.key === 'Enter') {
        // If a suggestion is selected, use it
        if (selectedSuggestionIndex >= 0 && suggestions.length > 0) {
          setInput(suggestions[selectedSuggestionIndex].name);
          setSelectedSuggestionIndex(-1);
        } else {
          handleSubmit();
        }
      } else {
        // Reset suggestion selection when typing
        setSelectedSuggestionIndex(-1);
      }
    },
    [suggestions, selectedSuggestionIndex, commandHistory, historyIndex, handleSubmit]
  );

  return {
    input,
    setInput,
    suggestions,
    selectedSuggestionIndex,
    visibleSections,
    helpShown,
    commandHistory,
    historyIndex,
    handleSubmit,
    handleKeyDown,
    commands: COMMANDS,
  };
}
