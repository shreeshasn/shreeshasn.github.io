```
 ██████╗   █████╗  ██████╗ ████████╗ ███████╗  ██████╗  ██╗      ██╗  ██████╗ 
██╔══██╗ ██╔═══██╗ ██╔══██╗╚══██╔══╝ ██╔════╝ ██╔═══██╗ ██║      ██║ ██╔═══██╗
██████╔╝ ██║   ██║ ██████╔╝   ██║    █████╗   ██║   ██║ ██║      ██║ ██║   ██║
██╔═══╝  ██║   ██║ ██╔══██╗   ██║    ██╔══╝   ██║   ██║ ██║      ██║ ██║   ██║
██║      ╚██████╔╝ ██║  ██║   ██║    ██║      ╚██████╔╝ ███████╗ ██║ ╚██████╔╝
╚═╝       ╚═════╝  ╚═╝  ╚═╝   ╚═╝    ╚═╝       ╚═════╝  ╚══════╝ ╚═╝  ╚═════╝ 
      Interactive Brutalist / TUI Digital Portfolio Artifact
```

Welcome to the **Interactive Brutalist / TUI Portfolio**—a high-performance, immersive digital artifact designed to merge the nostalgic reliability of Terminal User Interfaces (TUI) with modern 3D rendering and generative art. 

Built with **React 19**, **Vite 8**, **Three.js**, **D3.js**, and **Howler.js**, this portfolio is fully data-driven, highly optimized, and meticulously designed with a strict monochrome Brutalist aesthetic.

---

## ✦ Design Philosophy & Aesthetic Discipline

This digital artifact rejects the "soft" web of gradients, excessive rounded corners, and decorative bloat. Instead, it embraces high-contrast, structural typography and functional decoration.

*   **Monochrome Brutalism:** Fully responsive custom theme system (Light/Dark) mapping strictly to a curated 6-tier neutral color ladder (Ink, Charcoal, Body, Mute, Stone, Ash) and a 5-tier surface hierarchy.
*   **Hard Edges (`0px` Border-Radius):** Containers, sections, navbars, and cards use sharp rectangular edges. Interactive elements (buttons, inputs) leverage a subtle `4px` (`--rounded-sm`) radius.
*   **100% Monospaced Typography:** Styled entirely in **JetBrains Mono** to mimic classic manpages and static terminal listings.
*   **ASCII & Character Glyphs:** Bullets, section markers, and toggles are built using raw ASCII brackets (`[+]`, `[-]`, `[x]`) and structural elements rather than generic SVG icons.
*   **Tactile Audio-Visual Sync:** Integrated with `SoundManager` and `Howler.js` to trigger spatialized synthesized auditory feedback for every hover, click, and transition.

---

## 🕹️ Exploration Modes

This portfolio is divided into two distinct, high-fidelity experience modes, selectable upon initial system startup:

```
                  ┌─────────────────────────────────────┐
                  │          SYSTEM COLD LOAD           │
                  │ (Compiling assets, initializing...) │
                  └──────────────────┬──────────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  │       CHOOSE PORTFOLIO DISPATCH     │
                  └──────────┬──────────────────┬───────┘
                             │                  │
                ┌────────────┴───┐        ┌─────┴────────────┐
                │ 1. [UI Mode]   │        │ 2. [CLI Mode]    │
                │    "Boring"    │        │"SuperInteresting"|
                └────────────┬───┘        └─────┬────────────┘
                             │                  │
              ┌──────────────┴───┐     ┌────────┴─────────────┐
              │ Single Page HTML │     │ Real Interactive     │
              │ Flowing Resume   │     │ Terminal Window      │
              │ (/explore/ui)    │     │ (/explore/cli)       │
              └──────────────────┘     └────────┬─────────────┘
                                                │
                                    ┌───────────┴─────────────┐
                                    │ Command execution:      │
                                    │ /about /summary /skills │
                                    │ /projects /education    │
                                    │ /experience /contact    │
                                    └─────────────────────────┘
```

### 1. UI Mode `[ Boring ]` (`/explore/ui`)
A clean, elegant, single-page professional resume layout. It removes complex graphs and 3D scenes in favor of immediate content flow while keeping the high-contrast Brutalist theme, typography, and moving particle space background. The hero card is visually centered in the remaining viewport height below the top navbar, separated from the Education section by a clean, symmetric horizontal divider.

### 2. CLI Mode `[ Super Interesting ]` (`/explore/cli`)
An immersive, terminal-driven environment. Everything is hidden at first behind a simulated boot sequence. The user interacts through a live CLI prompt with dynamic auto-completion, tab suggestions, and history. 
Entering `/help` unveils available slash commands which render respective sections below with smooth, hardware-accelerated animations:
*   `/about` - Core personal information, titles, and location.
*   `/summary` - Bulleted overview with bold keyword highlighters and Lucide cues.
*   `/education` - A beautiful, interactive nested folder-tree structure depicting High School, Pre-University, and Degree courses.
*   `/experience` - Professional background displayed as editable-blocked code blocks inside an uneditable IDE frame.
*   `/skills` - Spawns the D3 interactive skill map.
*   `/projects` - Launches the Three.js 3D hologram cards.
*   `/achievements`, `/certifications`, `/extracurricular` - Stylized and gamified summaries of accomplishments.
*   `/resume` - Google Drive resume download utility.
*   `/contact` - Interactive terminal-aligned form and social list.

*   **Universal Keyboard Shortcut:** Pressing the `/` key anywhere on the site (unless typing in input fields) automatically redirects the viewport to CLI mode, scrolls the terminal box to the center, focuses the cursor, and populates the prompt with `/` to list suggestions.

---

## 🚀 Core Interactive Experiences

### 🌌 1. 3D Particle Field (`ParticleField.tsx`)
A WebGL background layer rendered via Three.js that responds to mouse movement and viewport changes, lending spatial depth and atmosphere to both modes without dragging down frame rates.

### 🕸️ 2. D3 Force-Directed Graph (`SkillGraph.tsx`)
An interactive, self-balancing physics simulation displaying technologies and their relationships. Users can drag nodes, zoom with a custom-engineered zoom dial, and select nodes to highlight dependencies.
*   **Node Text Display:** Sizing is optimized to render skill counts and proficiency percentages inside the node bubbles.
*   **Overlap Prevention:** Incorporates dynamic collision forces based on text length to automatically push nodes apart and keep labels from overlapping.
*   **Viewport Boundaries:** Clamps node coordinates inside the tick loop based on text metrics to ensure labels are never cut off or masked behind screen edges.
*   **Connected Fades:** Hovering over a cluster or individual node fades all non-connected elements to `0.05` opacity for concentrated focus.

### 💿 3. 3D Holographic Projects (`ProjectHologram.tsx`)
A declarative 3D scene built in `@react-three/fiber` and `@react-three/drei`. Project screenshots are projected onto floating holographic cards in virtual space with subtle hover tilt physics and glitch effects.

### 🔊 4. Synthesized Audio (`SoundManager.tsx` & `audio.ts`)
A dedicated Howler.js audio synthesizer that generates spatialized clicks, interface focus tones, keyboard typing clickers, and toggle alerts to sync actions with physical sound feedback.

---

## 🛠️ Tech Stack & Libraries

| Category | Technology |
| :--- | :--- |
| **Core Framework** | React 19 (TypeScript), Vite 8 |
| **3D Rendering** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Data Visualization** | D3.js (Force simulations) |
| **Animations** | Framer Motion |
| **Audio Processing** | Howler.js (Synthesized UI sounds) |
| **Metadata & SEO** | React Helmet Async |
| **Typography** | `@fontsource/jetbrains-mono` |

---

## 📂 Codebase Architecture

```
portfolio-new/
├── public/                 # Static assets, icons, and audio clips
├── src/
│   ├── components/         # Modular UI Components
│   │   ├── ContactSection.tsx     # TUI interactive contact form
│   │   ├── DynamicIcon.tsx        # Responsive Lucide icon wrapper
│   │   ├── FooterSection.tsx       # Standard Brutalist footer
│   │   ├── HeroSection.tsx         # Landing hero and CLI terminal controller
│   │   ├── ParticleField.tsx       # 3D interactive background field
│   │   ├── PrimaryNav.tsx          # Top navigation and mode switch rules
│   │   ├── ProjectHologram.tsx     # 3D R3F project hologram cards
│   │   ├── SEOHead.tsx             # Dynamic SEO metadata injector
│   │   ├── SkillGraph.tsx          # D3-powered force skill simulator
│   │   ├── SoundManager.tsx        # Howler audio registry wrapper
│   │   └── TimelineSection.tsx     # Vertical resume timeline
│   ├── context/            # Global State Manager
│   │   ├── PortfolioContext.tsx    # Hooks and state definitions
│   │   └── PortfolioProvider.tsx   # Holds JSON data, audio/theme toggles
│   ├── data/
│   │   └── portfolio.json  # MASTER DATABASE (Single Source of Truth)
│   ├── utils/
│   │   └── audio.ts        # Lower-level audio oscillators and cues
│   ├── App.tsx             # Main App layout router
│   ├── index.css           # Brutalist Design System styles & tokens
│   └── main.tsx            # Entrypoint
├── package.json            # Scripts & project dependencies
└── vite.config.ts          # Vite bundler configurations
```

---

## ⚙️ Development & Scripts

To get started with the repository locally, ensure you have **Node.js (v18+)** installed.

### Installation
```bash
npm install
```

### Script Directory

| Command | Action |
| :--- | :--- |
| `npm run dev` | Spins up the local Vite development server with hot module replacement (HMR). |
| `npm run build` | Compiles TypeScript and packages production-ready assets into the `dist/` folder. |
| `npm run preview` | Serves the built production bundle locally for previewing. |
| `npm run lint` | Runs ESLint configuration to check codebase health and alignment. |

---