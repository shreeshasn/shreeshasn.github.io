import React, { useState, useEffect } from 'react';
import { PortfolioContext } from './PortfolioContext';
import portfolioData from '../data/portfolio.json';
import type { Skill, Project, TimelineItem } from './PortfolioContext';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cast JSON file into structured types
  const data = portfolioData as Record<string, unknown>;
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const flags = data.featureFlags as { enableDarkMode: boolean };
    if (!flags.enableDarkMode) return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    const theme = data.theme as { colorScheme: string };
    return theme.colorScheme === 'dark';
  });

  // Sound state (default ON, stored in localStorage)
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    const flags = data.featureFlags as { enableSound: boolean };
    if (!flags.enableSound) return false;
    const stored = localStorage.getItem('sound');
    return stored ? stored === 'true' : true;
  });

  // Selected project state shared globally
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    const projects = data.projects as Project[];
    return projects[0]?.id || '';
  });

  // Synchronize dark mode class attribute
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Synchronize sound state with localStorage
  useEffect(() => {
    localStorage.setItem('sound', isSoundEnabled.toString());
  }, [isSoundEnabled]);

  const toggleDarkMode = () => {
    const flags = data.featureFlags as { enableDarkMode: boolean };
    if (flags.enableDarkMode) {
      setIsDarkMode(prev => !prev);
    }
  };

  const toggleSound = () => {
    const flags = data.featureFlags as { enableSound: boolean };
    if (flags.enableSound) {
      setIsSoundEnabled(prev => !prev);
    }
  };

  // Helper data accessors
  const getSkill = (id: string) => {
    const skills = data.skills as Skill[];
    return skills.find((s: Skill) => s.id === id);
  };

  const getProject = (id: string) => {
    const projects = data.projects as Project[];
    return projects.find((p: Project) => p.id === id);
  };

  const getProjectsBySkill = (skillId: string) => {
    const projects = data.projects as Project[];
    return projects.filter((p: Project) => p.skillsUsed.includes(skillId));
  };

  const getTimelineByPhase = (phase: 'fundamentals' | 'intermediate' | 'advanced') => {
    const timeline = data.timeline as TimelineItem[];
    return timeline
      .filter((t: TimelineItem) => t.phase === phase)
      .sort((a: TimelineItem, b: TimelineItem) => a.date.localeCompare(b.date));
  };

  return (
    <PortfolioContext.Provider
      value={{
        meta: data.meta as PortfolioContextType['meta'],
        identity: data.identity as PortfolioContextType['identity'],
        bio: data.bio as PortfolioContextType['bio'],
        skills: data.skills as PortfolioContextType['skills'],
        projects: data.projects as PortfolioContextType['projects'],
        timeline: data.timeline as PortfolioContextType['timeline'],
        education: data.education as PortfolioContextType['education'],
        certifications: data.certifications as PortfolioContextType['certifications'],
        workExperience: data.workExperience as PortfolioContextType['workExperience'],
        achievements: data.achievements as PortfolioContextType['achievements'],
        extracurricular: data.extracurricular as PortfolioContextType['extracurricular'],
        resume: data.resume as PortfolioContextType['resume'],
        cliQuotes: data.cliQuotes as PortfolioContextType['cliQuotes'],
        contact: data.contact as PortfolioContextType['contact'],
        social: data.social as PortfolioContextType['social'],
        theme: data.theme as PortfolioContextType['theme'],
        featureFlags: data.featureFlags as PortfolioContextType['featureFlags'],
        seo: data.seo as PortfolioContextType['seo'],
        isDarkMode,
        toggleDarkMode,
        isSoundEnabled,
        toggleSound,
        selectedProjectId,
        setSelectedProjectId,
        getSkill,
        getProject,
        getProjectsBySkill,
        getTimelineByPhase
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

// Import type for casting
import type { PortfolioContextType } from './PortfolioContext';
