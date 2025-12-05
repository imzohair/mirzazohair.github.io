# ZOHVECTOR - Bruno Simon-Style 3D Portfolio

A smooth, interactive Bruno Simon-inspired 3D portfolio experience featuring keyboard-controlled drone exploration, interactive section buildings, collectible data fragments, and gamification.

![ZOHVECTOR Logo](public/favicon.svg)

## 🚀 Features

### 🎮 Bruno Simon-Style 3D Experience
- **Keyboard-Controlled Drone**: Smooth WASD controls with third-person camera
- **5 Interactive Buildings**: Fly close to buildings to view content (About, Skills, Experience, Education, Contact)
- **10 Collectible Data Fragments**: Hidden cyan crystals across the map
- **Third-Person Camera**: Automatically follows drone from behind and above
- **Optimized Performance**: 60fps smooth gameplay, no lag

### ⚡ Gamification System
- **XP & Leveling**: Earn XP for exploration, collecting fragments, and interactions
- **Fragment Counter**: Track your collection progress (💎 0/10)
- **Achievements**: Unlock achievements for completing tasks
- **Progress Tracking**: All progress saved to localStorage

### 🎨 Design
- **Neon Cyberpunk Aesthetic**: Cyan, teal, purple, blue accents
- **Low-Poly Buildings**: Clean, simple geometric shapes
- **Glowing Effects**: Neon building tops, underglow, point lights
- **Grid Ground**: Wireframe grid overlay
- **Starfield Sky**: Atmospheric space background
- **Glassmorphism UI**: Frosted glass HUD and panels

### 🌐 Modes
- **3D Mode**: Full interactive flying experience
- **2D Mode**: Traditional scrolling portfolio website

## 🏗️ Architecture

```
src/components/3D/
└── GameScene.jsx (254 lines, self-contained)
    ├── SimpleDrone - Keyboard-controlled drone with velocity-based movement
    ├── FollowCam - Third-person camera that smoothly follows drone
    ├── Building - Interactive building component with proximity detection
    ├── Fragment - Collectible data crystal with collision detection
    └── Main scene - Ground, grid, lighting, fog, stars

src/components/UI/
├── HUD.jsx - In-game overlay with level, XP, fragment counter, controls
├── Panels.jsx - Information panels (About, Skills, etc.)
├── IntroScreen.jsx - Entry screen with mode selection
├── LoadingScreen.jsx - Asset loading screen
└── CinematicTrailer.jsx - Animated intro sequence

src/components/2D/
└── Mode2D.jsx - Full 2D portfolio layout

src/stores/
└── gameStore.js - Zustand state (XP, fragments, achievements, panels)

src/data/
└── portfolio.json - All portfolio content
```

## 🎮 Controls

| Key | Action |
|-----|--------|
| **W** | Move Forward |
| **S** | Move Backward |
| **A** | Rotate Left |
| **D** | Rotate Right |
| **SPACE** | Fly Up |
| **SHIFT** | Fly Down |

**Camera**: Automatically follows drone from behind and above. No mouse controls needed!

**Interaction**: Fly close to buildings (within ~15 units) to automatically open information panels.

## 🗺️ Map Layout

```
           NORTH
        SKILLS (Blue)
            (0,0,40)
              │
              │
WEST ────── CENTER ────── EAST
EDUCATION   ABOUT      EXPERIENCE
 (Teal)    (Cyan)      (Purple)
(-40,0,0)  (0,0,0)     (40,0,0)
              │
              │
           SOUTH
         CONTACT (Cyan)
            (0,0,-40)
```

**Data Fragments**: Scattered around the map at various positions. Look for glowing cyan crystals!

## 🎯 XP System

| Level | XP Required |
|-------|------------|
| 1 → 2 | 100 XP |
| 2 → 3 | 350 XP |
| 3 → 4 | 850 XP |
| 4 → 5 | 1650 XP |

### XP Sources
- **Visit a building**: +25 XP (first time)
- **Open a panel**: +15 XP (first time)
- **Collect data fragment**: +20 XP
- **Unlock achievement**: varies

**Total Fragments**: 10 x 20 XP = 200 XP available

## ⚙️ Tech Stack

- **React** 19.2 - UI framework
- **Vite** 7.2 - Build tool
- **Three.js** 0.181 - 3D rendering
- **React Three Fiber** 9.4 - React renderer for Three.js
- **@react-three/drei** 10.7 - 3D helpers (Text, Float, Stars)
- **Zustand** 5.0 - State management
- **Framer Motion** 12.23 - UI animations

**Note**: No physics engine used for optimal performance and reliability.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (opens at http://localhost:5173)
npm run dev
```

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 📦 Deployment

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `vite.config.js` if deploying to a subdirectory:
```js
base: '/your-repo-name/'
```

3. Deploy:
```bash
npm run deploy
```

## ✏️ Customizing Content

Edit `src/data/portfolio.json` to update:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "your@email.com",
    ...
  },
  "about": {
    "summary": "Your bio...",
    "highlights": [...]
  },
  "skills": {
    "programming": { "items": ["JavaScript", ...] },
    ...
  },
  "experience": [...],
  "education": [...],
  "achievements": [...],
  "badges": [...]
}
```

All changes will reflect in both 3D and 2D modes!

## 🎨 Customizing Visuals

### Building Colors
Edit in `GameScene.jsx`:
```javascript
const buildings = [
  { pos: [0, 0, 0], label: 'ABOUT', color: '#00E5FF', ... },
  // Change colors here
];
```

### Fragment Positions
Edit in `GameScene.jsx`:
```javascript
const fragments = [
  { id: 'frag_1', pos: [10, 3, 15] }, // [x, y, z]
  // Add or modify positions
];
```

### Control Speed
Edit in `SimpleDrone` component:
```javascript
const speed = 0.3; // Increase for faster movement
const turnSpeed = 0.05; // Increase for faster rotation
```

### Camera Distance
Edit in `FollowCam` component:
```javascript
const offset = new THREE.Vector3(0, 8, 15); 
// Change values: (side, height, distance)
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Black | #030308 | Background |
| Dark Ground | #050510 | Ground plane |
| Dark Metal | #0a0a15 | Buildings & drone |
| Neon Cyan | #00E5FF | About, Contact, grid, accents |
| Electric Blue | #2F6BFF | Skills building |
| Purple | #A066FF | Experience building |
| Teal | #00C2D1 | Education, drone underglow |
| Text Light | #E6F1FF | Primary text |
| Text Muted | #9BAEC8 | Secondary text |

## 💡 Performance Tips

The experience is optimized for smooth 60fps:
- ✅ Simple geometric shapes
- ✅ Limited number of lights (8 total)
- ✅ No physics engine overhead
- ✅ Efficient collision detection
- ✅ Limited draw calls

**If experiencing lag**:
1. Close other browser tabs
2. Lower pixel ratio in `GameScene.jsx`: `dpr={[1, 1]}`
3. Reduce star count: `count={1000}`

## 🐛 Troubleshooting

**Black screen after clicking Enter 3D World**:
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)
- Clear browser cache
- Check browser console for errors

**Controls not working**:
- Click on the page to focus it
- Ensure no other modals/panels are stealing focus

**Fragment not collecting**:
- Fly directly into it (within 3 units)
- Check HUD counter to see if already collected

## 📝 License

MIT License - Feel free to use this as a template for your own portfolio!

## 👤 Author

**Mirza Zohair Ali Baig**
- Email: rehansvcat@gmail.com
- LinkedIn: [mirza-zohair-ali-baig](https://www.linkedin.com/in/mirza-zohair-ali-baig-024749382/)
- GitHub: [imzohair](https://github.com/imzohair)

---

🚁 Inspired by [Bruno Simon's portfolio](https://bruno-simon.com/) - Built with ❤️ using React Three Fiber
