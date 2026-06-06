import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { UINav } from '../components/ui/UINav';
import { UIHeroSection } from '../components/ui/UIHeroSection';
import { UIEducationSection } from '../components/ui/UIEducationSection';
import { UIExperienceSection } from '../components/ui/UIExperienceSection';
import { UISkillsSection } from '../components/ui/UISkillsSection';
import { UIProjectsSection } from '../components/ui/UIProjectsSection';
import { UIAchievementsSection } from '../components/ui/UIAchievementsSection';
import { UIExtracurricularSection } from '../components/ui/UIExtracurricularSection';
import { UIResumeSection } from '../components/ui/UIResumeSection';
import { ContactSection } from '../components/ContactSection';
import { FooterSection } from '../components/FooterSection';

export const UIModePage: React.FC = () => {
  const { isDarkMode } = usePortfolio();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: isDarkMode ? 'var(--color-on-dark)' : 'var(--color-ink)',
      }}
    >
      <UINav />
      <main style={{ flex: 1, paddingTop: '56px' }}>
        <UIHeroSection />
        <UIEducationSection />
        <UIExperienceSection />
        <UISkillsSection />
        <UIProjectsSection />
        <UIAchievementsSection />
        <UIExtracurricularSection />
        <ContactSection />
        <UIResumeSection />
      </main>
      <FooterSection />
    </div>
  );
};
