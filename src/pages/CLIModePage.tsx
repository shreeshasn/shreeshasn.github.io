import React, { useState, useEffect } from 'react';
import { useTerminalEngine } from '../hooks/useTerminalEngine';
import { CLINav } from '../components/cli/CLINav';
import { CLITerminal } from '../components/cli/CLITerminal';
import { CLIFooter } from '../components/cli/CLIFooter';
import { AboutPanel } from '../components/cli/AboutPanel';
import { SummaryPanel } from '../components/cli/SummaryPanel';
import { EducationTree } from '../components/cli/EducationTree';
import { CodeExperience } from '../components/cli/CodeExperience';
import { SkillGraph } from '../components/SkillGraph';
import { ProjectHologram } from '../components/ProjectHologram';
import { AchievementWall } from '../components/cli/AchievementWall';
import { CertBadgeGrid } from '../components/cli/CertBadgeGrid';
import { ActivityFeed } from '../components/cli/ActivityFeed';
import { ResumeSection } from '../components/cli/ResumeSection';
import { ContactSection } from '../components/ContactSection';

// Map section names to their components
const SECTION_COMPONENTS: Record<string, React.FC> = {
  about: AboutPanel,
  summary: SummaryPanel,
  education: EducationTree,
  experience: CodeExperience,
  skills: SkillGraph,
  projects: ProjectHologram,
  achievements: AchievementWall,
  certifications: CertBadgeGrid,
  extracurricular: ActivityFeed,
  resume: ResumeSection,
  contact: ContactSection,
};

export const CLIModePage: React.FC = () => {
  const engine = useTerminalEngine();
  const hasSections = engine.visibleSections.length > 0;
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);

  // Monitor visibility of sections to show/hide the scroll prompt based on scroll position
  useEffect(() => {
    // Defer state update to avoid cascading synchronous render warning in effect body
    const timer = setTimeout(() => {
      if (hasSections) {
        const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 50;
        setShowScrollPrompt(isScrollable && window.scrollY < 120);
      } else {
        setShowScrollPrompt(false);
      }
    }, 100);

    if (hasSections) {
      const handleScroll = () => {
        const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 50;
        setShowScrollPrompt(isScrollable && window.scrollY < 120);
      };

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }

    return () => clearTimeout(timer);
  }, [hasSections, engine.visibleSections]);

  // Smoothly scroll to the section container when a new section is activated
  useEffect(() => {
    if (engine.visibleSections.length > 0) {
      const activeSection = engine.visibleSections[0];
      const timer = setTimeout(() => {
        const element = document.getElementById(activeSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback to scrolling page down
          window.scrollTo({
            top: window.innerHeight * 0.7,
            behavior: 'smooth',
          });
        }
      }, 180); // slight rendering frame offset
      return () => clearTimeout(timer);
    }
  }, [engine.visibleSections]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: hasSections ? '56px' : '0px',
        overflowY: hasSections ? 'visible' : 'hidden',
      }}
    >
      <CLINav />

      <main style={{ flex: 1 }}>
        {/* Terminal — always visible at top */}
        <CLITerminal engine={engine} />

        {/* Dynamically rendered sections based on entered commands */}
        {engine.visibleSections.map((sectionName) => {
          let ComponentToRender = null;
          if (sectionName === 'contact') {
            ComponentToRender = <ContactSection isCliMode={true} />;
          } else {
            const Component = SECTION_COMPONENTS[sectionName];
            if (Component) {
              ComponentToRender = <Component />;
            }
          }

          if (!ComponentToRender) return null;

          return (
            <div key={sectionName} className="cli-section-fade-in">
              {ComponentToRender}
            </div>
          );
        })}
      </main>

      <CLIFooter />

      {/* Floating Scroll Indicator Prompt */}
      {showScrollPrompt && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            pointerEvents: 'none',
            backgroundColor: 'var(--color-ink)',
            color: 'var(--color-canvas)',
            border: '1px solid var(--color-hairline-strong)',
            borderRadius: 'var(--rounded-none)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'bounce-scroll 1.6s ease-in-out infinite',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            letterSpacing: '0.5px',
          }}
        >
          <span>[+] OUTPUT GENERATED BELOW - SCROLL TO INSPECT</span>
          <span>↓</span>
        </div>
      )}

      <style>{`
        @keyframes cli-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .cli-section-fade-in {
          animation: cli-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes bounce-scroll {
          0%, 100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -6px);
          }
        }
      `}</style>
    </div>
  );
};
