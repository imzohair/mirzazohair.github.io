import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const XP_LEVELS = [
    { level: 1, xpRequired: 0 },
    { level: 2, xpRequired: 100 },
    { level: 3, xpRequired: 350 },
    { level: 4, xpRequired: 850 },
    { level: 5, xpRequired: 1650 },
    { level: 6, xpRequired: 2650 },
    { level: 7, xpRequired: 4000 },
    { level: 8, xpRequired: 5500 },
    { level: 9, xpRequired: 7500 },
    { level: 10, xpRequired: 10000 },
];

const calculateLevel = (xp) => {
    for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
        if (xp >= XP_LEVELS[i].xpRequired) {
            return {
                level: XP_LEVELS[i].level,
                currentXP: xp - XP_LEVELS[i].xpRequired,
                nextLevelXP: XP_LEVELS[i + 1]?.xpRequired - XP_LEVELS[i].xpRequired || 0,
                totalXP: xp,
            };
        }
    }
    return { level: 1, currentXP: 0, nextLevelXP: 100, totalXP: 0 };
};

export const useGameStore = create(
    persist(
        (set, get) => ({
            // Game State
            gamePhase: 'trailer', // 'trailer' | 'loading' | 'intro' | 'playing' | '2d'
            isDebugMode: false,
            soundEnabled: true,
            musicVolume: 0.5,
            sfxVolume: 0.7,

            // XP & Level
            xp: 0,
            level: 1,

            // Districts Visited
            visitedDistricts: {
                about: false,
                skills: false,
                experience: false,
                education: false,
                contact: false,
                tower: false,
            },

            // Panels Opened
            openedPanels: {
                about: false,
                skills: false,
                experience: false,
                education: false,
                contact: false,
                resume: false,
                achievements: false,
                settings: false,
            },

            // Achievements
            unlockedAchievements: [],

            // Badges
            unlockedBadges: [],

            // Data Fragments
            collectedFragments: [],

            // Flight Stats
            flightStats: {
                totalFlightTime: 0,
                maxAltitudeReached: 0,
                maxSpeedReached: 0,
                totalDistance: 0,
            },

            // Current UI
            activePanel: null,
            showHUD: true,

            // Actions
            setGamePhase: (phase) => set({ gamePhase: phase }),
            toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),
            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
            setMusicVolume: (vol) => set({ musicVolume: vol }),
            setSfxVolume: (vol) => set({ sfxVolume: vol }),

            addXP: (amount, reason) => {
                const newXP = get().xp + amount;
                const levelInfo = calculateLevel(newXP);
                const oldLevel = get().level;

                set({
                    xp: newXP,
                    level: levelInfo.level,
                });

                // Check for level up
                if (levelInfo.level > oldLevel) {
                    // Trigger level up notification
                    console.log(`Level Up! Now level ${levelInfo.level}`);
                }

                return { xpGained: amount, reason, levelUp: levelInfo.level > oldLevel };
            },

            getXPProgress: () => {
                const xp = get().xp;
                return calculateLevel(xp);
            },

            visitDistrict: (district) => {
                const visited = get().visitedDistricts;
                if (!visited[district]) {
                    set({
                        visitedDistricts: { ...visited, [district]: true }
                    });
                    get().addXP(25, `Visited ${district} district`);

                    // Check for explorer achievement
                    const newVisited = { ...visited, [district]: true };
                    const allVisited = Object.values(newVisited).every(v => v);
                    if (allVisited) {
                        get().unlockAchievement('ach_explorer');
                    }
                }
            },

            openPanel: (panel) => {
                const opened = get().openedPanels;
                if (!opened[panel]) {
                    set({
                        openedPanels: { ...opened, [panel]: true }
                    });
                    get().addXP(15, `Opened ${panel} panel`);

                    // Check for info seeker achievement
                    const newOpened = { ...opened, [panel]: true };
                    const allOpened = ['about', 'skills', 'experience', 'education', 'contact'].every(p => newOpened[p]);
                    if (allOpened) {
                        get().unlockAchievement('ach_panels');
                    }
                }
                set({ activePanel: panel });
            },

            closePanel: () => set({ activePanel: null }),

            unlockAchievement: (achievementId) => {
                const unlocked = get().unlockedAchievements;
                if (!unlocked.includes(achievementId)) {
                    set({
                        unlockedAchievements: [...unlocked, achievementId]
                    });
                    // XP is awarded based on achievement
                    return true;
                }
                return false;
            },

            unlockBadge: (badgeId) => {
                const unlocked = get().unlockedBadges;
                if (!unlocked.includes(badgeId)) {
                    set({
                        unlockedBadges: [...unlocked, badgeId]
                    });
                    get().addXP(50, `Unlocked badge: ${badgeId}`);
                    return true;
                }
                return false;
            },

            collectFragment: (fragmentId) => {
                const collected = get().collectedFragments;
                if (!collected.includes(fragmentId)) {
                    set({
                        collectedFragments: [...collected, fragmentId]
                    });
                    get().addXP(20, 'Collected data fragment');

                    // Check for collector achievement
                    if (collected.length + 1 >= 10) {
                        get().unlockAchievement('ach_collector');
                        get().unlockBadge('badge_collector');
                    }
                    return true;
                }
                return false;
            },

            updateFlightStats: (stats) => {
                const current = get().flightStats;
                const updated = {
                    totalFlightTime: current.totalFlightTime + (stats.flightTime || 0),
                    maxAltitudeReached: Math.max(current.maxAltitudeReached, stats.altitude || 0),
                    maxSpeedReached: Math.max(current.maxSpeedReached, stats.speed || 0),
                    totalDistance: current.totalDistance + (stats.distance || 0),
                };
                set({ flightStats: updated });

                // Check for flight achievements
                if (updated.maxAltitudeReached >= 50 && !get().unlockedAchievements.includes('ach_altitude')) {
                    get().unlockAchievement('ach_altitude');
                }
                if (updated.maxSpeedReached >= 20 && !get().unlockedAchievements.includes('ach_speed')) {
                    get().unlockAchievement('ach_speed');
                }
                if (updated.totalFlightTime >= 1 && !get().unlockedAchievements.includes('ach_first_flight')) {
                    get().unlockAchievement('ach_first_flight');
                }
                if (updated.totalFlightTime >= 300 && !get().unlockedAchievements.includes('ach_night_owl')) {
                    get().unlockAchievement('ach_night_owl');
                }
            },

            setShowHUD: (show) => set({ showHUD: show }),

            // Reset game progress
            resetProgress: () => set({
                xp: 0,
                level: 1,
                visitedDistricts: {
                    about: false,
                    skills: false,
                    experience: false,
                    education: false,
                    contact: false,
                    tower: false,
                },
                openedPanels: {
                    about: false,
                    skills: false,
                    experience: false,
                    education: false,
                    contact: false,
                    resume: false,
                    achievements: false,
                    settings: false,
                },
                unlockedAchievements: [],
                unlockedBadges: [],
                collectedFragments: [],
                flightStats: {
                    totalFlightTime: 0,
                    maxAltitudeReached: 0,
                    maxSpeedReached: 0,
                    totalDistance: 0,
                },
            }),

            // Get completion percentage
            getCompletionPercentage: () => {
                const state = get();
                const districtCount = Object.values(state.visitedDistricts).filter(Boolean).length;
                const panelCount = Object.values(state.openedPanels).filter(Boolean).length;
                const achievementCount = state.unlockedAchievements.length;
                const fragmentCount = state.collectedFragments.length;

                const total = 6 + 8 + 8 + 10; // districts + panels + achievements + fragments
                const completed = districtCount + panelCount + achievementCount + fragmentCount;

                return Math.round((completed / total) * 100);
            },
        }),
        {
            name: 'zohvector-game-storage',
            partialize: (state) => ({
                xp: state.xp,
                level: state.level,
                visitedDistricts: state.visitedDistricts,
                openedPanels: state.openedPanels,
                unlockedAchievements: state.unlockedAchievements,
                unlockedBadges: state.unlockedBadges,
                collectedFragments: state.collectedFragments,
                flightStats: state.flightStats,
                soundEnabled: state.soundEnabled,
                musicVolume: state.musicVolume,
                sfxVolume: state.sfxVolume,
            }),
        }
    )
);

export default useGameStore;
