import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import useGameStore from '../../stores/gameStore';
import portfolioData from '../../data/portfolio.json';
import './Mode2D.css';

const Mode2D = () => {
    const setGamePhase = useGameStore(state => state.setGamePhase);
    const { personal, about, skills, experience, education } = portfolioData;
    const { level, getXPProgress, unlockedAchievements, getCompletionPercentage } = useGameStore();

    const xpProgress = getXPProgress();
    const completion = getCompletionPercentage();

    // Track active section
    const [activeSection, setActiveSection] = useState('hero');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [targetSection, setTargetSection] = useState(null);

    // Section positions for drone animation
    const sectionPositions = {
        hero: { top: '10%', right: '40px' },
        about: { top: '25%', right: '40px' },
        skills: { top: '40%', right: '40px' },
        experience: { top: '55%', right: '40px' },
        education: { top: '70%', right: '40px' },
        contact: { top: '85%', right: '40px' },
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isTransitioning) return; // Don't update during animation

            const sections = ['hero', 'about', 'skills', 'experience', 'education', 'contact'];
            const scrollPos = window.scrollY + window.innerHeight / 2;

            for (const sectionId of sections) {
                const section = document.getElementById(sectionId);
                if (section) {
                    const { offsetTop, offsetHeight } = section;
                    if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isTransitioning]);

    const handleNavClick = (sectionId) => {
        if (sectionId === activeSection) return;

        // Start drone transition animation
        setIsTransitioning(true);
        setTargetSection(sectionId);

        // Wait for animation to complete, then scroll
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                setActiveSection(sectionId);
            }
            setTimeout(() => {
                setIsTransitioning(false);
                setTargetSection(null);
            }, 800);
        }, 1000);
    };

    const currentPos = sectionPositions[activeSection] || sectionPositions.hero;
    const targetPos = targetSection ? sectionPositions[targetSection] : currentPos;

    return (
        <div className="mode-2d-container">
            {/* Animated Drone - 3D Flying Effect */}
            <AnimatePresence>
                <motion.div
                    className="floating-drone"
                    initial={currentPos}
                    animate={isTransitioning ? [
                        // Stage 1: Fly toward camera (grow BIG)
                        {
                            ...currentPos,
                            scale: 1,
                            rotate: 0,
                        },
                        // Stage 2: At center, HUGE (closest to camera)
                        {
                            top: '50%',
                            right: '50%',
                            translateX: '50%',
                            translateY: '-50%',
                            scale: 3.5,
                            rotate: 180,
                        },
                        // Stage 3: Fly away (shrink small)
                        {
                            top: '50%',
                            right: '50%',
                            translateX: '50%',
                            translateY: '-50%',
                            scale: 0.3,
                            rotate: 270,
                        },
                        // Stage 4: Arrive at target position
                        {
                            ...targetPos,
                            scale: 1,
                            rotate: 360,
                        }
                    ] : currentPos}
                    transition={{
                        duration: isTransitioning ? 1.5 : 0.5,
                        times: isTransitioning ? [0, 0.35, 0.65, 1] : undefined,
                        ease: isTransitioning ? 'easeInOut' : 'easeOut'
                    }}
                >
                    <svg viewBox="0 0 100 100" width="60" height="60">
                        {/* Drone body */}
                        <polygon
                            points="50,30 65,50 50,70 35,50"
                            fill="#00E5FF"
                            opacity="0.8"
                        />
                        {/* Rotors */}
                        <circle cx="35" cy="35" r="8" fill="none" stroke="#00E5FF" strokeWidth="2" opacity="0.6" />
                        <circle cx="65" cy="35" r="8" fill="none" stroke="#00E5FF" strokeWidth="2" opacity="0.6" />
                        <circle cx="35" cy="65" r="8" fill="none" stroke="#00E5FF" strokeWidth="2" opacity="0.6" />
                        <circle cx="65" cy="65" r="8" fill="none" stroke="#00E5FF" strokeWidth="2" opacity="0.6" />
                        {/* Glow */}
                        <circle cx="50" cy="50" r="5" fill="#00C2D1" />
                    </svg>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <nav className="nav-2d">
                <div className="nav-brand">
                    <svg viewBox="0 0 200 180" width="32" height="28">
                        <polygon
                            points="100,10 180,50 180,130 100,170 20,130 20,50"
                            fill="rgba(0, 229, 255, 0.1)"
                            stroke="#00E5FF"
                            strokeWidth="4"
                        />
                        <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                    </svg>
                    <span>ZOHVECTOR</span>
                </div>
                <div className="nav-links">
                    <a
                        href="#about"
                        onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}
                        className={activeSection === 'about' ? 'active' : ''}
                    >
                        About
                    </a>
                    <a
                        href="#skills"
                        onClick={(e) => { e.preventDefault(); handleNavClick('skills'); }}
                        className={activeSection === 'skills' ? 'active' : ''}
                    >
                        Skills
                    </a>
                    <a
                        href="#experience"
                        onClick={(e) => { e.preventDefault(); handleNavClick('experience'); }}
                        className={activeSection === 'experience' ? 'active' : ''}
                    >
                        Experience
                    </a>
                    <a
                        href="#education"
                        onClick={(e) => { e.preventDefault(); handleNavClick('education'); }}
                        className={activeSection === 'education' ? 'active' : ''}
                    >
                        Education
                    </a>
                    <a
                        href="#contact"
                        onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
                        className={activeSection === 'contact' ? 'active' : ''}
                    >
                        Contact
                    </a>
                </div>
                <button
                    className="nav-3d-btn"
                    onClick={() => setGamePhase('playing')}
                >
                    Enter 3D Mode
                </button>
            </nav>

            {/* Hero Section */}
            <section className="hero-2d" id="hero">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <svg className="hero-logo" viewBox="0 0 200 180" width="120" height="108">
                        <polygon
                            points="100,10 180,50 180,130 100,170 20,130 20,50"
                            fill="rgba(0, 229, 255, 0.1)"
                            stroke="#00E5FF"
                            strokeWidth="2"
                        />
                        <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                        <circle cx="60" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                        <circle cx="140" cy="60" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                        <circle cx="60" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                        <circle cx="140" cy="120" r="12" fill="none" stroke="#00E5FF" strokeWidth="2" />
                    </svg>
                    <h1>{personal.name}</h1>
                    <p className="hero-title">{personal.title}</p>
                    <p className="hero-tagline">{personal.tagline}</p>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="stat-value">Level {level}</span>
                            <span className="stat-label">Explorer</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-value">{xpProgress.totalXP} XP</span>
                            <span className="stat-label">Experience</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-value">{completion}%</span>
                            <span className="stat-label">Complete</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* About Section */}
            <section className="section-2d" id="about">
                <motion.div
                    className="section-content"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">ABOUT ME</h2>
                    <p className="section-text">{about.summary}</p>
                    <div className="highlights-grid">
                        {about.highlights.map((highlight, i) => (
                            <div key={i} className="highlight-item">
                                <span className="highlight-icon">▸</span>
                                {highlight}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Skills Section */}
            <section className="section-2d dark" id="skills">
                <motion.div
                    className="section-content"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">SKILLS</h2>
                    <div className="skills-grid-2d">
                        {Object.entries(skills).map(([key, category]) => (
                            <div key={key} className="skill-card-2d">
                                <div className="skill-card-header">
                                    <span className="skill-emoji">
                                        {category.icon === 'code' ? '💻' :
                                            category.icon === 'globe' ? '🌐' :
                                                category.icon === 'tool' ? '🔧' : '👥'}
                                    </span>
                                    <h3>{category.label}</h3>
                                </div>
                                <div className="skill-tags-2d">
                                    {category.items.map((skill, i) => (
                                        <span key={i} className="skill-tag-2d">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Experience Section */}
            <section className="section-2d" id="experience">
                <motion.div
                    className="section-content"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">EXPERIENCE</h2>
                    <div className="timeline-2d">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={exp.id}
                                className="timeline-item-2d"
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="timeline-dot" />
                                <div className="timeline-content">
                                    <div className="timeline-header">
                                        <h3>{exp.title}</h3>
                                        <span className="timeline-type">{exp.type}</span>
                                    </div>
                                    <p className="timeline-org">{exp.organization}</p>
                                    <p className="timeline-period">{exp.period}</p>
                                    <p className="timeline-desc">{exp.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Education Section */}
            <section className="section-2d dark" id="education">
                <motion.div
                    className="section-content"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">EDUCATION</h2>
                    <div className="education-grid-2d">
                        {education.map((edu) => (
                            <div key={edu.id} className="education-card-2d">
                                <div className="edu-icon">🎓</div>
                                <h3>{edu.degree}</h3>
                                <p className="edu-institution">{edu.institution}</p>
                                <p className="edu-location">{edu.location}</p>
                                <p className="edu-period">{edu.period}</p>
                                <span className="edu-status">{edu.status}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Contact Section */}
            <section className="section-2d contact-section" id="contact">
                <motion.div
                    className="section-content"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">GET IN TOUCH</h2>
                    <p className="contact-intro">Ready to connect? Reach out through any of these channels:</p>
                    <div className="contact-grid-2d">
                        <a href={`mailto:${personal.email}`} className="contact-card-2d">
                            <span className="contact-emoji">✉️</span>
                            <span className="contact-type">Email</span>
                            <span className="contact-value">{personal.email}</span>
                        </a>
                        <a href={`tel:${personal.phone}`} className="contact-card-2d">
                            <span className="contact-emoji">📱</span>
                            <span className="contact-type">Phone</span>
                            <span className="contact-value">{personal.phone}</span>
                        </a>
                        <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card-2d">
                            <span className="contact-emoji">💼</span>
                            <span className="contact-type">LinkedIn</span>
                            <span className="contact-value">View Profile</span>
                        </a>
                        <a href={personal.github} target="_blank" rel="noopener noreferrer" className="contact-card-2d">
                            <span className="contact-emoji">🐙</span>
                            <span className="contact-type">GitHub</span>
                            <span className="contact-value">View Projects</span>
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="footer-2d">
                <div className="footer-content">
                    <div className="footer-brand">
                        <svg viewBox="0 0 200 180" width="40" height="36">
                            <polygon
                                points="100,10 180,50 180,130 100,170 20,130 20,50"
                                fill="rgba(0, 229, 255, 0.1)"
                                stroke="#00E5FF"
                                strokeWidth="4"
                            />
                            <polygon points="100,55 130,90 100,125 70,90" fill="#00C2D1" />
                        </svg>
                        <span>ZOHVECTOR</span>
                    </div>
                    <p>© 2025 {personal.name}. Futuristic Portfolio Experience.</p>
                    <div className="footer-links">
                        <a href={personal.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href={personal.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                        <a href={`mailto:${personal.email}`}>Email</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Mode2D;
