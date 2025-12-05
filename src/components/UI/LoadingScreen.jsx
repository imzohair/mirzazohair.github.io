import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../stores/gameStore';
import './LoadingScreen.css';

const loadingTexts = [
    "Initializing ZOHVECTOR Systems…",
    "Loading Futuristic City…",
    "Booting Hover Drone…",
    "Calibrating Navigation…",
    "Systems Online…"
];

const LoadingScreen = ({ progress = 0, isLoaded = false }) => {
    const [textIndex, setTextIndex] = useState(0);
    const setGamePhase = useGameStore(state => state.setGamePhase);

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex(prev => (prev + 1) % loadingTexts.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            const timeout = setTimeout(() => {
                setGamePhase('intro');
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [isLoaded, setGamePhase]);

    return (
        <div className="loading-container">
            {/* Logo */}
            <div className="loading-logo-container">
                <svg className="loading-hexagon" viewBox="0 0 200 180" width="120" height="108">
                    <polygon
                        className="hex-bg"
                        points="100,10 180,50 180,130 100,170 20,130 20,50"
                        fill="rgba(0, 229, 255, 0.05)"
                        stroke="#00E5FF"
                        strokeWidth="2"
                    />
                    <g className="loading-drone">
                        <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                        <circle cx="60" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" className="rotor" />
                        <circle cx="140" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" className="rotor" />
                        <circle cx="60" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" className="rotor" />
                        <circle cx="140" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" className="rotor" />
                    </g>
                </svg>

                {/* Orbit ring */}
                <motion.div
                    className="orbit-ring"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                    <div className="orbit-dot" />
                </motion.div>
            </div>

            {/* Brand name */}
            <h1 className="loading-brand">ZOHVECTOR</h1>

            {/* Loading text */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={textIndex}
                    className="loading-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {loadingTexts[textIndex]}
                </motion.p>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="loading-progress-container">
                <div className="loading-progress-track">
                    <motion.div
                        className="loading-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: isLoaded ? '100%' : `${Math.min(progress, 95)}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <span className="loading-progress-text">
                    {isLoaded ? '100' : Math.min(Math.round(progress), 95)}%
                </span>
            </div>

            {/* Decorative elements */}
            <div className="loading-decoration top-left">
                <div className="corner-bracket" />
            </div>
            <div className="loading-decoration top-right">
                <div className="corner-bracket" />
            </div>
            <div className="loading-decoration bottom-left">
                <div className="corner-bracket" />
            </div>
            <div className="loading-decoration bottom-right">
                <div className="corner-bracket" />
            </div>

            {/* Scan line effect */}
            <div className="scan-line" />
        </div>
    );
};

export default LoadingScreen;
