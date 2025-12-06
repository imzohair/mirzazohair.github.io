import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../stores/gameStore';
import useMobile from '../../hooks/useMobile';
import './HUD.css';

const HUD = ({ nearestBuilding }) => {
    const {
        level,
        showHUD,
        setGamePhase,
        getXPProgress,
        collectedFragments,
        toggleMobileControls,
        mobileControls
    } = useGameStore();

    const isMobile = useMobile(); // Use the hook to check for mobile
    const xpProgress = getXPProgress();

    if (!showHUD) return null;

    return (
        <div className="hud-wrapper">
            {/* Top Left - Brand */}
            <motion.div
                className="hud-section hud-top-left"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="hud-brand">
                    <svg viewBox="0 0 200 180" width="28" height="25">
                        <polygon
                            points="100,10 180,50 180,130 100,170 20,130 20,50"
                            fill="rgba(0, 229, 255, 0.1)"
                            stroke="#00E5FF"
                            strokeWidth="4"
                        />
                        <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                    </svg>
                    <span className="hud-logo-text">ZOHVECTOR</span>
                </div>
                <div className="hud-player-info">
                    <span className="hud-name">Mirza Zohair Ali Baig</span>
                </div>
            </motion.div>

            {/* Top Right - Level & XP */}
            <motion.div
                className="hud-section hud-top-right"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="hud-level">
                    <span className="hud-level-label">LEVEL</span>
                    <span className="hud-level-value">{level}</span>
                </div>
                <div className="hud-xp">
                    <div className="hud-xp-bar">
                        <div
                            className="hud-xp-fill"
                            style={{
                                width: xpProgress.nextLevelXP > 0
                                    ? `${(xpProgress.currentXP / xpProgress.nextLevelXP) * 100}%`
                                    : '100%'
                            }}
                        />
                    </div>
                    <span className="hud-xp-text">
                        {xpProgress.currentXP} / {xpProgress.nextLevelXP || 'MAX'} XP
                    </span>
                </div>
            </motion.div>

            {/* Bottom Left - Controls & Fragments */}
            <motion.div
                className="hud-section hud-bottom-left"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="hud-controls">
                    <div className="hud-control">
                        <span className="hud-key">WASD</span>
                        <span className="hud-control-label">Move</span>
                    </div>
                    <div className="hud-control">
                        <span className="hud-key">SPACE</span>
                        <span className="hud-control-label">Up</span>
                    </div>
                    <div className="hud-control">
                        <span className="hud-key">E</span>
                        <span className="hud-control-label">Interact</span>
                    </div>
                </div>
                <div className="hud-fragments">
                    <span className="hud-fragment-icon">💎</span>
                    <span className="hud-fragment-text">Fragments: {collectedFragments.length}/10</span>
                </div>
            </motion.div>

            {/* Bottom Right - 2D Mode Button */}
            <motion.div
                className="hud-section hud-bottom-right"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <button
                    className="hud-button"
                    onClick={() => setGamePhase('2d')}
                >
                    2D MODE
                </button>
                <button
                    className="hud-button"
                    onClick={toggleMobileControls}
                    style={{ marginLeft: '10px' }}
                    title="Toggle Touch Controls"
                >
                    🎮
                </button>
            </motion.div>

            {/* Center Interaction Prompt */}
            <AnimatePresence>
                {nearestBuilding && (
                    <motion.div
                        className="hud-interact-prompt"
                        initial={{ y: 20, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -20, opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <div className="interact-prompt-content">
                            <span className="interact-key">{isMobile ? '◎' : 'E'}</span>
                            <span className="interact-text">{isMobile ? 'tap to view' : 'to view'}</span>
                            <span className="interact-label">{nearestBuilding.toUpperCase()}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom hint */}
            <motion.div
                className="hud-center-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1, duration: 1 }}
            >
                Collect diamonds and explore • v1.3 • Mobile: {isMobile ? 'ON' : 'OFF'}
            </motion.div>
        </div>
    );
};

export default HUD;
