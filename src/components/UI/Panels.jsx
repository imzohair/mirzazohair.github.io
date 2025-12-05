import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../stores/gameStore';
import portfolioData from '../../data/portfolio.json';
import './Panels.css';

// Generic Panel Wrapper
const PanelWrapper = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="panel-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="panel glass-panel"
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="panel-header">
                            <h2 className="panel-title">{title}</h2>
                            <button className="panel-close" onClick={onClose}>×</button>
                        </div>
                        <div className="panel-body">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// About Panel
export const AboutPanel = ({ isOpen, onClose }) => {
    const { personal, about } = portfolioData;

    return (
        <PanelWrapper isOpen={isOpen} onClose={onClose} title="ABOUT">
            <div className="about-content">
                <div className="about-header">
                    <div className="about-avatar">
                        <svg viewBox="0 0 200 180" width="80" height="72">
                            <polygon
                                points="100,10 180,50 180,130 100,170 20,130 20,50"
                                fill="rgba(0, 229, 255, 0.1)"
                                stroke="#00E5FF"
                                strokeWidth="3"
                            />
                            <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                        </svg>
                    </div>
                    <div className="about-info">
                        <h3>{personal.name}</h3>
                        <p className="about-title">{personal.title}</p>
                        <p className="about-location">📍 {personal.location}</p>
                    </div>
                </div>
                <p className="about-summary">{about.summary}</p>
                <div className="about-highlights">
                    <h4>Highlights</h4>
                    <ul>
                        {about.highlights.map((highlight, i) => (
                            <li key={i}>{highlight}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </PanelWrapper>
    );
};

// Skills Panel
export const SkillsPanel = ({ isOpen, onClose }) => {
    const { skills } = portfolioData;

    return (
        <PanelWrapper isOpen={isOpen} onClose={onClose} title="SKILLS">
            <div className="skills-grid">
                {Object.entries(skills).map(([key, category]) => (
                    <div key={key} className="skill-category">
                        <div className="skill-category-header">
                            <span className="skill-icon">{
                                category.icon === 'code' ? '💻' :
                                    category.icon === 'globe' ? '🌐' :
                                        category.icon === 'tool' ? '🔧' : '👥'
                            }</span>
                            <h4>{category.label}</h4>
                        </div>
                        <div className="skill-items">
                            {category.items.map((skill, i) => (
                                <span key={i} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </PanelWrapper>
    );
};

// Experience Panel
export const ExperiencePanel = ({ isOpen, onClose }) => {
    const { experience } = portfolioData;

    return (
        <PanelWrapper isOpen={isOpen} onClose={onClose} title="EXPERIENCE">
            <div className="experience-timeline">
                {experience.map((exp, i) => (
                    <div key={exp.id} className="experience-item">
                        <div className="experience-marker">
                            <div className="marker-dot" />
                            {i < experience.length - 1 && <div className="marker-line" />}
                        </div>
                        <div className="experience-content">
                            <div className="experience-header">
                                <h4>{exp.title}</h4>
                                <span className="experience-type">{exp.type}</span>
                            </div>
                            <p className="experience-org">{exp.organization}</p>
                            <p className="experience-period">{exp.period}</p>
                            <p className="experience-desc">{exp.description}</p>
                            <div className="experience-achievements">
                                {exp.achievements.map((ach, j) => (
                                    <span key={j} className="achievement-tag">• {ach}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PanelWrapper>
    );
};

// Education Panel
export const EducationPanel = ({ isOpen, onClose }) => {
    const { education } = portfolioData;

    return (
        <PanelWrapper isOpen={isOpen} onClose={onClose} title="EDUCATION">
            <div className="education-list">
                {education.map((edu) => (
                    <div key={edu.id} className="education-item">
                        <div className="education-icon">🎓</div>
                        <div className="education-content">
                            <h4>{edu.degree}</h4>
                            <p className="education-institution">{edu.institution}</p>
                            <p className="education-location">{edu.location}</p>
                            <p className="education-period">{edu.period}</p>
                            <span className="education-status">{edu.status}</span>
                            {edu.coursework && (
                                <div className="education-coursework">
                                    <strong>Coursework:</strong> {edu.coursework.join(', ')}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </PanelWrapper>
    );
};

// Contact Panel
export const ContactPanel = ({ isOpen, onClose }) => {
    const { personal } = portfolioData;

    return (
        <PanelWrapper isOpen={isOpen} onClose={onClose} title="CONTACT">
            <div className="contact-content">
                <p className="contact-intro">Get in touch with me through any of these channels:</p>
                <div className="contact-grid">
                    <a href={`mailto:${personal.email}`} className="contact-item">
                        <span className="contact-icon">✉️</span>
                        <span className="contact-label">Email</span>
                        <span className="contact-value">{personal.email}</span>
                    </a>
                    <a href={`tel:${personal.phone}`} className="contact-item">
                        <span className="contact-icon">📱</span>
                        <span className="contact-label">Phone</span>
                        <span className="contact-value">{personal.phone}</span>
                    </a>
                    <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item">
                        <span className="contact-icon">💼</span>
                        <span className="contact-label">LinkedIn</span>
                        <span className="contact-value">View Profile</span>
                    </a>
                    <a href={personal.github} target="_blank" rel="noopener noreferrer" className="contact-item">
                        <span className="contact-icon">🐙</span>
                        <span className="contact-label">GitHub</span>
                        <span className="contact-value">View Projects</span>
                    </a>
                </div>
            </div>
        </PanelWrapper>
    );
};

// Resume Panel
export const ResumePanel = ({ isOpen, onClose }) => {
    const { personal, about, skills, experience, education } = portfolioData;

    return (
        <PanelWrapper isOpen={isOpen} onClose={onClose} title="RESUME">
            <div className="resume-content">
                <div className="resume-header">
                    <svg viewBox="0 0 200 180" width="60" height="54">
                        <polygon
                            points="100,10 180,50 180,130 100,170 20,130 20,50"
                            fill="rgba(0, 229, 255, 0.1)"
                            stroke="#00E5FF"
                            strokeWidth="3"
                        />
                        <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                    </svg>
                    <div>
                        <h3>{personal.name}</h3>
                        <p>{personal.title}</p>
                    </div>
                </div>

                <section className="resume-section">
                    <h4>Summary</h4>
                    <p>{about.summary}</p>
                </section>

                <section className="resume-section">
                    <h4>Key Skills</h4>
                    <div className="resume-skills">
                        {Object.values(skills).flatMap(cat => cat.items.slice(0, 3)).map((skill, i) => (
                            <span key={i} className="skill-tag">{skill}</span>
                        ))}
                    </div>
                </section>

                <section className="resume-section">
                    <h4>Experience Highlights</h4>
                    {experience.slice(0, 3).map(exp => (
                        <div key={exp.id} className="resume-exp">
                            <strong>{exp.title}</strong> - {exp.organization} ({exp.period})
                        </div>
                    ))}
                </section>

                <section className="resume-section">
                    <h4>Education</h4>
                    {education.map(edu => (
                        <div key={edu.id} className="resume-edu">
                            <strong>{edu.degree}</strong>
                            <p>{edu.institution}</p>
                        </div>
                    ))}
                </section>

                <div className="resume-actions">
                    <button className="neon-button neon-button-filled">
                        📄 Download PDF
                    </button>
                    <button className="neon-button">
                        🔗 Open in New Tab
                    </button>
                </div>
            </div>
        </PanelWrapper>
    );
};

// Achievements Panel
export const AchievementsPanel = ({ isOpen, onClose }) => {
    const { achievements } = portfolioData;
    const unlockedAchievements = useGameStore(state => state.unlockedAchievements);
    const { level, getXPProgress, getCompletionPercentage } = useGameStore();
    const xpProgress = getXPProgress();
    const completion = getCompletionPercentage();

    return (
        <PanelWrapper isOpen={isOpen} onClose={onClose} title="ACHIEVEMENTS">
            <div className="achievements-content">
                <div className="achievements-stats">
                    <div className="stat-box">
                        <span className="stat-value">{level}</span>
                        <span className="stat-label">Level</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">{xpProgress.totalXP}</span>
                        <span className="stat-label">Total XP</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">{completion}%</span>
                        <span className="stat-label">Complete</span>
                    </div>
                </div>

                <div className="achievements-grid">
                    {achievements.map((ach) => {
                        const isUnlocked = unlockedAchievements.includes(ach.id);
                        return (
                            <div key={ach.id} className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                                <div className="achievement-icon">
                                    {isUnlocked ? '🏆' : '🔒'}
                                </div>
                                <div className="achievement-info">
                                    <h5>{ach.name}</h5>
                                    <p>{ach.description}</p>
                                    <span className="achievement-xp">+{ach.xp} XP</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PanelWrapper>
    );
};

// Settings Panel
export const SettingsPanel = ({ isOpen, onClose }) => {
    const {
        soundEnabled,
        toggleSound,
        musicVolume,
        setMusicVolume,
        sfxVolume,
        setSfxVolume,
        isDebugMode,
        toggleDebugMode,
        resetProgress
    } = useGameStore();

    return (
        <PanelWrapper isOpen={isOpen} onClose={onClose} title="SETTINGS">
            <div className="settings-content">
                <div className="setting-group">
                    <h4>Audio</h4>
                    <div className="setting-item">
                        <label>Sound Effects</label>
                        <button
                            className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
                            onClick={toggleSound}
                        >
                            {soundEnabled ? 'ON' : 'OFF'}
                        </button>
                    </div>
                    <div className="setting-item">
                        <label>Music Volume</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={musicVolume * 100}
                            onChange={(e) => setMusicVolume(e.target.value / 100)}
                        />
                    </div>
                    <div className="setting-item">
                        <label>SFX Volume</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sfxVolume * 100}
                            onChange={(e) => setSfxVolume(e.target.value / 100)}
                        />
                    </div>
                </div>

                <div className="setting-group">
                    <h4>Display</h4>
                    <div className="setting-item">
                        <label>Debug Mode</label>
                        <button
                            className={`toggle-btn ${isDebugMode ? 'active' : ''}`}
                            onClick={toggleDebugMode}
                        >
                            {isDebugMode ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                <div className="setting-group">
                    <h4>Data</h4>
                    <button className="neon-button danger" onClick={resetProgress}>
                        Reset Progress
                    </button>
                </div>
            </div>
        </PanelWrapper>
    );
};

export default {
    AboutPanel,
    SkillsPanel,
    ExperiencePanel,
    EducationPanel,
    ContactPanel,
    ResumePanel,
    AchievementsPanel,
    SettingsPanel,
};
