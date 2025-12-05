import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../stores/gameStore';
import './CinematicTrailer.css';

const CinematicTrailer = () => {
    const [phase, setPhase] = useState(0);
    const setGamePhase = useGameStore(state => state.setGamePhase);
    const containerRef = useRef(null);

    useEffect(() => {
        const timings = [1000, 1500, 1500, 1000, 1000];
        let totalTime = 0;

        const timeouts = timings.map((timing, index) => {
            totalTime += timing;
            return setTimeout(() => setPhase(index + 1), totalTime);
        });

        const finishTimeout = setTimeout(() => {
            setGamePhase('loading');
        }, totalTime + 500);

        return () => {
            timeouts.forEach(clearTimeout);
            clearTimeout(finishTimeout);
        };
    }, [setGamePhase]);

    const skipTrailer = () => {
        setGamePhase('loading');
    };

    return (
        <div className="trailer-container" ref={containerRef} onClick={skipTrailer}>
            <AnimatePresence mode="wait">
                {/* Phase 0: Black screen with cyan dot */}
                {phase === 0 && (
                    <motion.div
                        key="phase0"
                        className="trailer-phase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="awakening-dot"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1, 1.2, 1] }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </motion.div>
                )}

                {/* Phase 1: Hexagon draws itself with drone icon */}
                {phase === 1 && (
                    <motion.div
                        key="phase1"
                        className="trailer-phase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <svg className="hexagon-logo" viewBox="0 0 200 180" width="180" height="160">
                            <motion.polygon
                                className="hexagon-outline"
                                points="100,10 180,50 180,130 100,170 20,130 20,50"
                                fill="none"
                                stroke="#00E5FF"
                                strokeWidth="3"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            />
                            <motion.g
                                className="drone-icon"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                {/* Diamond body */}
                                <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                                {/* Rotor circles */}
                                <circle cx="60" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                                <circle cx="140" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                                <circle cx="60" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                                <circle cx="140" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                            </motion.g>
                        </svg>
                        <motion.h1
                            className="brand-name"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            ZOHVECTOR SYSTEMS
                        </motion.h1>
                    </motion.div>
                )}

                {/* Phase 2: Wireframe city grid appears */}
                {phase === 2 && (
                    <motion.div
                        key="phase2"
                        className="trailer-phase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="city-grid-container">
                            <motion.div
                                className="city-grid"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="grid-building"
                                        style={{
                                            height: `${30 + Math.random() * 70}px`,
                                            left: `${i * 5}%`,
                                        }}
                                        initial={{ opacity: 0, scaleY: 0 }}
                                        animate={{ opacity: 1, scaleY: 1 }}
                                        transition={{ delay: i * 0.05, duration: 0.3 }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                        <svg className="hexagon-logo small" viewBox="0 0 200 180" width="100" height="90">
                            <polygon
                                points="100,10 180,50 180,130 100,170 20,130 20,50"
                                fill="none"
                                stroke="#00E5FF"
                                strokeWidth="3"
                            />
                            <g className="drone-icon">
                                <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                                <circle cx="60" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                                <circle cx="140" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                                <circle cx="60" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                                <circle cx="140" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                            </g>
                        </svg>
                    </motion.div>
                )}

                {/* Phase 3: Drone icon rotates */}
                {phase === 3 && (
                    <motion.div
                        key="phase3"
                        className="trailer-phase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.svg
                            className="hexagon-logo rotating"
                            viewBox="0 0 200 180"
                            width="140"
                            height="125"
                            animate={{ rotateY: 360 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        >
                            <polygon
                                points="100,10 180,50 180,130 100,170 20,130 20,50"
                                fill="none"
                                stroke="#00E5FF"
                                strokeWidth="3"
                            />
                            <g className="drone-icon">
                                <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                                <circle cx="60" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                                <circle cx="140" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                                <circle cx="60" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                                <circle cx="140" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                            </g>
                        </motion.svg>
                        <motion.p
                            className="hover-online"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.5, 1] }}
                            transition={{ duration: 1, times: [0, 0.5, 0.7, 1] }}
                        >
                            HOVER DRONE ONLINE
                        </motion.p>
                    </motion.div>
                )}

                {/* Phase 4: Dissolve transition */}
                {phase >= 4 && (
                    <motion.div
                        key="phase4"
                        className="trailer-phase"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="dissolve-particles">
                            {[...Array(50)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="particle"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    initial={{ opacity: 1, scale: 1 }}
                                    animate={{
                                        opacity: 0,
                                        scale: 0,
                                        x: (Math.random() - 0.5) * 200,
                                        y: (Math.random() - 0.5) * 200,
                                    }}
                                    transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.p
                className="skip-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
            >
                Click anywhere to skip
            </motion.p>
        </div>
    );
};

export default CinematicTrailer;
