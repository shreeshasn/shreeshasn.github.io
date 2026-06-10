import React from 'react';

// Default fallback keywords for bold highlighting
const DEFAULT_KEYWORDS = [
  'Software Engineer',
  'AI/ML Intern',
  'Team Leader',
  'Solo Developer',
  'Artsy Technologies',
  'Machine Learning',
  'Generative AI',
  'applied AI',
  'system design',
  'software engineering',
  'full-stack',
  'multi-agent systems',
  'microservices'
];

export function highlightKeywords(text: string, customKeywords?: string[]): React.ReactNode {
  if (!text) return '';
  
  const keywordsList = customKeywords && customKeywords.length > 0 ? customKeywords : DEFAULT_KEYWORDS;
  
  // Sort keywords by length descending to prevent partial replacements
  const sortedKeywords = [...keywordsList].sort((a, b) => b.length - a.length);
  
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const pattern = sortedKeywords.map(escapeRegExp).join('|');
  if (!pattern) return text;
  
  const regex = new RegExp(`(${pattern})`, 'gi');
  
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = sortedKeywords.some(
          (kw) => kw.toLowerCase() === part.toLowerCase()
        );
        if (isMatch) {
          return (
            <strong key={i} style={{ color: 'var(--color-ink)', fontWeight: 700 }}>
              {part}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}
