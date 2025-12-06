import { useState, useEffect, useCallback } from 'react';
import useGameStore from './stores/gameStore';
import useMobile from './hooks/useMobile';

// UI Components
import CinematicTrailer from './components/UI/CinematicTrailer';
import LoadingScreen from './components/UI/LoadingScreen';
import IntroScreen from './components/UI/IntroScreen';
import HUD from './components/UI/HUD';
import MobileControls from './components/UI/MobileControls';
import {
  AboutPanel,
  SkillsPanel,
  ExperiencePanel,
  EducationPanel,
  ContactPanel,
  ResumePanel,
  AchievementsPanel,
  SettingsPanel,
} from './components/UI/Panels';

// 3D Components
import GameScene from './components/3D/GameScene';

// 2D Components
import Mode2D from './components/2D/Mode2D';

// Styles
import './styles/index.css';

function App() {
  const gamePhase = useGameStore(state => state.gamePhase);
  const activePanel = useGameStore(state => state.activePanel);
  const openPanel = useGameStore(state => state.openPanel);
  const closePanel = useGameStore(state => state.closePanel);
  const isMobile = useMobile();

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [nearestBuilding, setNearestBuilding] = useState(null); // Track which building is near

  // Simulate loading progress
  useEffect(() => {
    if (gamePhase === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsLoaded(true);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [gamePhase]);

  // Handle panel triggers (proximity)
  const handlePanelTrigger = useCallback((panel) => {
    // Just set the nearest building, don't auto-open
    setNearestBuilding(panel);
  }, []);

  // Clear nearest building when leaving
  const handlePanelLeave = useCallback(() => {
    setNearestBuilding(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gamePhase === 'intro' && (e.key === 'Enter' || e.key === ' ')) {
        useGameStore.getState().setGamePhase('playing');
      }

      if (gamePhase === 'playing') {
        switch (e.key.toLowerCase()) {
          case 'escape':
            if (activePanel) {
              import('./utils/soundManager').then(({ default: soundManager }) => {
                soundManager.panelClose();
              });
              closePanel();
            }
            break;
          case 'e':
            // Open panel for nearest building
            if (nearestBuilding && !activePanel) {
              import('./utils/soundManager').then(({ default: soundManager }) => {
                soundManager.panelOpen();
              });
              openPanel(nearestBuilding);
            }
            break;
          case 'tab':
            e.preventDefault();
            if (activePanel) {
              closePanel();
            } else {
              openPanel('settings');
            }
            break;
          case 'r':
            if (!activePanel) openPanel('resume');
            break;
          case 'a':
            if (!activePanel && e.ctrlKey) openPanel('achievements');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase, activePanel, nearestBuilding, openPanel, closePanel]);

  return (
    <div className="app">
      {/* Trailer Phase */}
      {gamePhase === 'trailer' && <CinematicTrailer />}

      {/* Loading Phase */}
      {gamePhase === 'loading' && (
        <LoadingScreen progress={loadingProgress} isLoaded={isLoaded} />
      )}

      {/* Intro Phase */}
      {gamePhase === 'intro' && <IntroScreen />}

      {/* 3D Playing Phase */}
      {gamePhase === 'playing' && (
        <>
          <GameScene
            onPanelTrigger={handlePanelTrigger}
            onPanelLeave={handlePanelLeave}
          />
          <HUD nearestBuilding={nearestBuilding} />

          <HUD nearestBuilding={nearestBuilding} />
          {isMobile && <MobileControls />}

          {/* Panels */}
          <AboutPanel
            isOpen={activePanel === 'about'}
            onClose={closePanel}
          />
          <SkillsPanel
            isOpen={activePanel === 'skills'}
            onClose={closePanel}
          />
          <ExperiencePanel
            isOpen={activePanel === 'experience'}
            onClose={closePanel}
          />
          <EducationPanel
            isOpen={activePanel === 'education'}
            onClose={closePanel}
          />
          <ContactPanel
            isOpen={activePanel === 'contact'}
            onClose={closePanel}
          />
          <ResumePanel
            isOpen={activePanel === 'resume'}
            onClose={closePanel}
          />
          <AchievementsPanel
            isOpen={activePanel === 'achievements'}
            onClose={closePanel}
          />
          <SettingsPanel
            isOpen={activePanel === 'settings'}
            onClose={closePanel}
          />
        </>
      )}

      {/* 2D Mode */}
      {gamePhase === '2d' && <Mode2D />}
    </div>
  );
}

export default App;
