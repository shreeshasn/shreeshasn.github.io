import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { usePortfolio } from '../context/PortfolioContext';
import type { Project } from '../context/PortfolioContext';
import { playSynthSound } from '../utils/audio';
import * as THREE from 'three';

// Rotating hologram mesh component
const HologramMesh: React.FC<{ 
  shapeType: string; 
  color: string; 
}> = ({ shapeType, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotation animation
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.3;
    meshRef.current.rotation.y = time * 0.4;
    // Breathing scale effect
    const scale = 1.0 + Math.sin(time * 2) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  // Pick shape geometry based on type
  const renderGeometry = () => {
    switch (shapeType) {
      case 'platonis-ai':
        return <torusKnotGeometry args={[1, 0.3, 100, 16]} />;
      case 'noetis-ai':
        return <icosahedronGeometry args={[1.2, 1]} />;
      case 'audita':
        return <torusGeometry args={[0.8, 0.3, 16, 100]} />;
      case 'vox':
        return <boxGeometry args={[1.3, 1.3, 1.3]} />;
      case 'vanguard':
        return <dodecahedronGeometry args={[1.2, 0]} />;
      case 'algoscale':
        return <coneGeometry args={[1, 2, 32]} />;
      case 'nexuserp':
        return <cylinderGeometry args={[1, 1, 2, 32]} />;
      case 'the-devils-advocate':
        return <octahedronGeometry args={[1.3, 0]} />;
      case 'turtlegraphics':
        return <tetrahedronGeometry args={[1.2, 0]} />;
      case 'portfolio-website':
        return <capsuleGeometry args={[0.6, 1, 8, 16]} />;
      default:
        return <dodecahedronGeometry args={[1.2, 0]} />;
    }
  };

  return (
    <mesh ref={meshRef}>
      {renderGeometry()}
      <meshBasicMaterial 
        color={color} 
        wireframe={true} 
        transparent={true} 
        opacity={0.7} 
      />
    </mesh>
  );
};

export const ProjectHologram: React.FC = () => {
  const { 
    projects, 
    skills, 
    isSoundEnabled, 
    isDarkMode, 
    selectedProjectId, 
    setSelectedProjectId 
  } = usePortfolio();
  
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

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const handleSelectProject = (id: string) => {
    if (id !== selectedProjectId) {
      playSynthSound('whoosh', isSoundEnabled);
      setSelectedProjectId(id);
    }
  };

  const handleOpenModal = (project: Project) => {
    playSynthSound('click', isSoundEnabled);
    setModalProject(project);
  };

  const handleCloseModal = () => {
    playSynthSound('click', isSoundEnabled);
    setModalProject(null);
  };

  // Light/Dark colors for 3D wireframe
  const wireframeColor = isDarkMode ? '#fdfcfc' : '#201d1d';

  return (
    <section id="projects" className="content-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-canvas)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>
          [+] Interactive Project Holograms
        </h2>
        <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 'var(--spacing-xs) 0 0 0' }}>
          // Click cards to launch holographic inspectors. Rotate mesh with cursor click/drag.
        </p>
      </div>

      <div className="projects-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-xl)' }}>
        
        {/* Left Side: 3D Hologram Display */}
        <div 
          className="hairline-border hologram-sticky-container"
          style={{
            height: '420px',
            backgroundColor: 'var(--color-surface-soft)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'var(--spacing-md)'
          }}
        >
          {/* Header metadata label */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.75rem', 
              color: 'var(--color-stone)',
              zIndex: 2,
              position: 'relative'
            }}
          >
            <span>HOLOGRAM_OUTPUT // {activeProject?.id.toUpperCase()}</span>
            <span>ROTATION_AXIS: X/Y</span>
          </div>

          {/* Canvas Component */}
          <div style={{ position: 'absolute', top: '30px', left: 0, width: '100%', height: 'calc(100% - 60px)', zIndex: 1 }}>
            <Canvas camera={{ position: [0, 0, 4.2], fov: 55 }}>
              <ambientLight intensity={0.5} />
              <HologramMesh shapeType={selectedProjectId} color={wireframeColor} />
              <OrbitControls enableZoom={false} autoRotate={false} />
            </Canvas>
          </div>

          {/* Floating HUD controls on bottom */}
          <div 
            style={{ 
              zIndex: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-end',
              fontSize: '0.75rem', 
              color: 'var(--color-stone)' 
            }}
          >
            <div>
              <div>SHAPE: {
                selectedProjectId === 'platonis-ai' ? 'Torus Knot' :
                selectedProjectId === 'noetis-ai' ? 'Icosahedron' :
                selectedProjectId === 'audita' ? 'Torus' :
                selectedProjectId === 'vox' ? 'Box' :
                selectedProjectId === 'vanguard' ? 'Dodecahedron' :
                selectedProjectId === 'algoscale' ? 'Cone' :
                selectedProjectId === 'nexuserp' ? 'Cylinder' :
                selectedProjectId === 'the-devils-advocate' ? 'Octahedron' :
                selectedProjectId === 'turtlegraphics' ? 'Tetrahedron' :
                selectedProjectId === 'portfolio-website' ? 'Capsule' :
                'Platonic Solid'
              }</div>
              <div>COMPLEXITY: {activeProject?.complexity.toUpperCase()}</div>
            </div>
            <div>
              <span>DRAG TO ROTATE ⦁</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Project Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {projects.map(proj => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <div
                key={proj.id}
                id={`project-card-${proj.id}`}
                onClick={() => handleSelectProject(proj.id)}
                className="hairline-border transition-all-300"
                style={{
                  padding: 'var(--spacing-lg)',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--color-surface-soft)' : 'var(--color-canvas)',
                  borderColor: isSelected ? 'var(--color-ink)' : 'var(--color-hairline)',
                  borderWidth: '1px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        color: isSelected ? 'var(--color-accent)' : 'var(--color-stone)',
                        fontWeight: 700 
                      }}
                    >
                      {isSelected ? '[ ACTIVE ]' : '[ STATIC ]'}
                    </span>
                    <h3 className="heading-md" style={{ color: 'var(--color-ink)', marginTop: '2px' }}>
                      {proj.title}
                    </h3>
                  </div>
                  <span 
                    className="badge-news"
                    style={{
                      backgroundColor: proj.status === 'completed' ? 'rgba(48,209,88,0.15)' : 'rgba(255,159,10,0.15)',
                      color: proj.status === 'completed' ? 'var(--color-success)' : 'var(--color-warning)'
                    }}
                  >
                    {proj.status}
                  </span>
                </div>

                <p className="body-md line-clamp-2" style={{ color: 'var(--color-body)', margin: 0 }}>
                  {proj.shortDescription}
                </p>

                {/* Skills tags footer */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-xs)' }}>
                  {proj.skillsUsed.map(skillId => {
                    const skill = skills.find(s => s.id === skillId);
                    return (
                      <span key={skillId} style={{ fontSize: '0.6875rem', color: 'var(--color-mute)' }}>
                        #{skill ? skill.name.toLowerCase() : skillId}
                      </span>
                    );
                  })}
                </div>

                {/* Action button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(proj);
                  }}
                  className="button-secondary"
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: 'var(--spacing-sm)',
                    height: '30px',
                    padding: '2px 12px',
                    fontSize: '0.75rem'
                  }}
                >
                  Inspect details [→]
                </button>
              </div>
            );
          })}
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
                "We need to go deeper. You are viewing the brutalist portfolio of the brutalist portfolio website itself — a recursion level inside the reality layer."
              </div>
            )}

            {/* Overview / Narrative */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>OVERVIEW //</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {modalProject.longDescription
                  .split('. ')
                  .map((sentence) => sentence.trim())
                  .filter(Boolean)
                  .map((sentence, index) => {
                    const cleanSentence = sentence.endsWith('.') ? sentence : sentence + '.';
                    return (
                      <li key={index} className="body-md" style={{ color: 'var(--color-body)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--color-accent)', marginTop: '2px' }}>[+]</span>
                        <span style={{ flex: 1 }}>{cleanSentence}</span>
                      </li>
                    );
                  })}
              </ul>
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
        @media (min-width: 851px) {
          .projects-layout {
            grid-template-columns: 1.2fr 1fr !important;
            align-items: start;
          }
          .hologram-sticky-container {
            position: sticky !important;
            top: 96px !important;
            z-index: 10;
          }
          .modal-challenges {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
