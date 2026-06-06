import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PortfolioProvider } from './context/PortfolioProvider';
import { SoundManager } from './components/SoundManager';
import { SEOHead } from './components/SEOHead';
import { ParticleField } from './components/ParticleField';
import { ExplorePage } from './pages/ExplorePage';
import { UIModePage } from './pages/UIModePage';
import { CLIModePage } from './pages/CLIModePage';

function App() {
  return (
    <PortfolioProvider>
      <HelmetProvider>
        {/* Core dynamic audio bindings */}
        <SoundManager />
        
        {/* Dynamic header injection */}
        <SEOHead />
        
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
