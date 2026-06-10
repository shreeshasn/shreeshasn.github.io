import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PortfolioProvider } from './context/PortfolioProvider';
import { SoundManager } from './components/SoundManager';
import { SEOHead } from './components/SEOHead';
import { ParticleField } from './components/ParticleField';
import { ExplorePage } from './pages/ExplorePage';
import { UIModePage } from './pages/UIModePage';
import { CLIModePage } from './pages/CLIModePage';
import { MobileWarning } from './components/MobileWarning';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.getAttribute('contenteditable') === 'true'
      )) {
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        if (location.pathname !== '/explore/cli') {
          navigate('/explore/cli', { state: { triggerSlash: true } });
        } else {
          window.dispatchEvent(new CustomEvent('trigger-cli-slash'));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, navigate]);
  return (
    <PortfolioProvider>
      <HelmetProvider>
        {/* Core dynamic audio bindings */}
        <SoundManager />
        
        {/* Dynamic header injection */}
        <SEOHead />
        
        {/* Mobile warning message for desktop optimization */}
        <MobileWarning />
        
        {/* Global space background with interactive particles */}
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: 0, 
            pointerEvents: 'none' 
          }}
        >
          <ParticleField />
        </div>
        
        {/* Route structure */}
        <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/explore" replace />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/explore/ui" element={<UIModePage />} />
            <Route path="/explore/cli" element={<CLIModePage />} />
          </Routes>
        </div>
      </HelmetProvider>
    </PortfolioProvider>
  );
}

export default App;
