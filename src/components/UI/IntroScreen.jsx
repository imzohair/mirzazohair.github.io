import { motion } from 'framer-motion';
import useGameStore from '../../stores/gameStore';
import './IntroScreen.css';

const IntroScreen = () => {
    const setGamePhase = useGameStore(state => state.setGamePhase);

    const handleStart = () => {
        setGamePhase('playing');
    };

    const handleStart2D = () => {
        setGamePhase('2d');
    };

    return (
        <motion.div
            className="intro-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="intro-content">
                {/* Logo */}
                <motion.div
                    className="intro-logo"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <svg viewBox="0 0 200 180" width="140" height="126">
                        <polygon
                            points="100,10 180,50 180,130 100,170 20,130 20,50"
                            fill="rgba(0, 229, 255, 0.05)"
                            stroke="#00E5FF"
                            strokeWidth="2"
                        />
                        <g>
                            <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                            <circle cx="60" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                            <circle cx="140" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                            <circle cx="60" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                            <circle cx="140" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                        </g>
                    </svg>
                </motion.div>

                {/* Brand */}
                <motion.h1
                    className="intro-brand"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    ZOHVECTOR
                </motion.h1>

                {/* Name */}
                <motion.h2
                    className="intro-name"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    Mirza Zohair Ali Baig
                </motion.h2>

                {/* Title */}
                <motion.p
                    className="intro-title"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    Futuristic 3D Portfolio Experience
                </motion.p>

                {/* Description */}
                <motion.p
                    className="intro-description"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    Explore a cyber-city with your hover drone.
                    <br />
                    Discover projects, skills, and achievements.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    className="intro-buttons"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <button className="neon-button neon-button-filled" onClick={handleStart}>
                        <span className="button-icon">▶</span>
                        Enter 3D World
                    </button>
                    <button className="neon-button" onClick={handleStart2D}>
                        <span className="button-icon">◧</span>
                        Simple 2D View
                    </button>
                </motion.div>

                {/* Controls hint */}
                <motion.div
                    className="intro-controls"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                >
                    <div className="control-group">
                        <span className="control-keys">W A S D</span>
                        <span className="control-label">Move</span>
                    </div>
                    <div className="control-group">
                        <span className="control-keys">SPACE / SHIFT</span>
                        <span className="control-label">Up / Down</span>
                    </div>
                    <div className="control-group">
                        <span className="control-keys">MOUSE</span>
                        <span className="control-label">Look</span>
                    </div>
                </motion.div>

                {/* Press any key hint */}
                <motion.p
                    className="intro-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ delay: 2, duration: 2, repeat: Infinity }}
                >
                    Press ENTER or click to begin
                </motion.p>
            </div>

            {/* Background particles */}
            <div className="intro-particles">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="intro-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, 20],
                            opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Decorative lines */}
            <div className="intro-line intro-line-left" />
            <div className="intro-line intro-line-right" />
        </motion.div>
    );
};

export default IntroScreen;
