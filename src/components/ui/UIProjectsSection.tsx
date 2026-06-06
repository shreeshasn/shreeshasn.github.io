import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import type { Project } from '../../context/PortfolioContext';
import { playSynthSound } from '../../utils/audio';

export const UIProjectsSection: React.FC = () => {
  const { projects, isSoundEnabled } = usePortfolio();
  const visible = projects.filter((p) => !p.hideFromPublic && !p.archived);

  const [modalProject, setModalProject] = useState<Project | null>(null);

  // Lock body scroll when inspector modal is active
  useEffect(() => {
    if (modalProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalProject]);

  const handleOpenModal = (project: Project) => {
    playSynthSound('click', isSoundEnabled);
    setModalProject(project);
  };

  const handleCloseModal = () => {
    playSynthSound('click', isSoundEnabled);
    setModalProject(null);
  };

  return (
    <section id="projects" className="section-spacing content-container" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-surface-soft)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)',
        }}
      >
        <div>
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>[+] Projects</h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
            // Selected works and experiments.
          </p>
        </div>

        <div className="ui-projects-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
          {visible.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="hairline-border transition-all-300"
              style={{
                padding: 'var(--spacing-xl)',
                backgroundColor: 'var(--color-canvas)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                <div>
                  <h3 className="body-strong" style={{ color: 'var(--color-ink)', margin: 0 }}>{project.title}</h3>
                  <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 0 }}>{project.subtitle}</p>
                </div>
                <span
                  className="badge-news"
                  style={{
                    fontSize: '0.6875rem',
                    backgroundColor: project.status === 'completed' ? 'var(--color-surface-soft)' : 'var(--color-surface-dark)',
                    color: project.status === 'completed' ? 'var(--color-mute)' : 'var(--color-on-dark)',
                  }}
                >
                  {project.status.toUpperCase()}
                </span>
              </div>

              <p className="body-md" style={{ color: 'var(--color-body)', margin: 0, fontSize: '0.875rem' }}>
                {project.shortDescription}
              </p>

              {/* Tech Stack */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                {[...project.techStack.frontend, ...project.techStack.backend, ...project.techStack.deployment].map((tech) => (
                  <span key={tech} className="badge-news" style={{ fontSize: '0.6875rem', backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-mute)', border: '1px solid var(--color-hairline)' }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links & Action button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover-reveal"
                      style={{ color: 'var(--color-ink)', fontSize: '0.8125rem', textDecoration: 'underline' }}
                      onClick={() => playSynthSound('click', isSoundEnabled)}
                    >
                      [→] GitHub
                    </a>
                  )}
                  {project.links.liveDemo && (
                    <a
                      href={project.links.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="hover-reveal"
                      style={{ color: 'var(--color-ink)', fontSize: '0.8125rem', textDecoration: 'underline' }}
                      onClick={() => playSynthSound('click', isSoundEnabled)}
                    >
                      [→] Live Demo
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleOpenModal(project)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-ink)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Inspect Details"
                >
                  [→]
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TUI Detail Inspector Modal */}
      {modalProject && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-lg)'
          }}
          onClick={handleCloseModal}
        >
          {/* Modal pane */}
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '85vh',
              overflowY: 'auto',
              backgroundColor: 'var(--color-canvas)',
              border: '1px solid var(--color-ink)',
              borderRadius: 'var(--rounded-none)',
              padding: 'var(--spacing-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xl)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close trigger button */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                color: 'var(--color-ink)'
              }}
            >
              [×] CLOSE
            </button>

            {/* Header section */}
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-mute)' }}>
                PROJECT_INSPECTOR // {modalProject.id.toUpperCase()}
              </span>
              <h2 className="heading-lg" style={{ color: 'var(--color-ink)', marginTop: 'var(--spacing-xs)' }}>
                {modalProject.title}
              </h2>
              <span className="caption-md" style={{ color: 'var(--color-stone)' }}>
                Role: {modalProject.role} | Duration: {modalProject.duration}
              </span>
            </div>

            {/* Inception Easter Egg */}
            {modalProject.id === 'portfolio-website' && (
              <div 
                className="hairline-border"
                style={{ 
                  padding: 'var(--spacing-md)', 
                  backgroundColor: 'var(--color-surface-soft)', 
                  borderLeft: '3px solid var(--color-accent)', 
                  fontStyle: 'italic', 
                  color: 'var(--color-accent)',
                  fontSize: '0.8125rem'
                }}
              >
                "We need to go deeper. You are viewing the portfolio of the portfolio website itself — a recursion level inside the reality layer."
              </div>
            )}

            {/* Overview / Narrative */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>OVERVIEW //</span>
              <p className="body-md" style={{ color: 'var(--color-body)', margin: 0 }}>
                {modalProject.longDescription}
              </p>
            </div>

            {/* Problem & Solution TUI blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }} className="modal-challenges">
              <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface-soft)', borderLeft: '3px solid var(--color-danger)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 700 }}>THE CHALLENGE //</div>
                <p className="body-md" style={{ color: 'var(--color-body)', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
                  {modalProject.description.challenge}
                </p>
              </div>

              <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface-soft)', borderLeft: '3px solid var(--color-success)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>THE SOLUTION //</div>
                <p className="body-md" style={{ color: 'var(--color-body)', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
                  {modalProject.description.solution}
                </p>
              </div>
            </div>

            {/* Technical stack install snippets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>REBUILD INSTANT SNIPPET //</span>
              <div 
                style={{ 
                  padding: 'var(--spacing-md)', 
                  backgroundColor: 'var(--color-surface-soft)', 
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-ink)',
                  border: '1px solid var(--color-hairline)'
                }}
              >
                {`$ npm install ${modalProject.skillsUsed.join(' ')} --save`}
              </div>
            </div>

            {/* Key learnings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>KEY LEARNINGS //</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {modalProject.keyLearnings.map((learn, idx) => (
                  <li key={idx} className="body-md" style={{ color: 'var(--color-body)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--color-accent)' }}>[+]</span>
                    <span>{learn}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metrics cards */}
            {Object.keys(modalProject.metrics).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>MEASURED METRICS //</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--spacing-md)' }}>
                  {Object.entries(modalProject.metrics).map(([key, val]) => (
                    <div 
                      key={key} 
                      className="hairline-border"
                      style={{ 
                        padding: 'var(--spacing-md)', 
                        backgroundColor: 'var(--color-surface-soft)',
                        textAlign: 'center'
                      }}
                    >
                      <div className="heading-md" style={{ color: 'var(--color-ink)' }}>{val}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--color-mute)', textTransform: 'uppercase', marginTop: '2px' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resource links */}
            <div style={{ display: 'flex', gap: 'var(--spacing-xl)', paddingTop: 'var(--spacing-xs)' }}>
              {modalProject.links.github && (
                <a 
                  href={modalProject.links.github} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontSize: '0.875rem', fontWeight: 500 }}
                  onClick={() => playSynthSound('click', isSoundEnabled)}
                >
                  Source Repository [→]
                </a>
              )}
              {modalProject.links.liveDemo && (
                <a 
                  href={modalProject.links.liveDemo} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontSize: '0.875rem', fontWeight: 500 }}
                  onClick={() => playSynthSound('click', isSoundEnabled)}
                >
                  Live Deployment [→]
                </a>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @media (min-width: 769px) {
          .ui-projects-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
};
