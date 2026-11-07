# 💍 Romantic Wrapped 2025 | تجربة سينمائية تفاعلية

> **An Awwwards-grade, hyper-cinematic desktop web experience fusing the interactive storytelling of Spotify Wrapped with a romantic, bridal wedding scrapbook aesthetic.**

---

## ✨ Overview • نظرة عامة

This application is built as an **"Anti-Website"**:
- **Zero Native Scroll**: Native document scrolling is completely disabled (`overflow: hidden`).
- **Interactive Film Feel**: Controlled strictly through keyboard arrow navigation, debounced mouse-wheel gestures, and tactile on-screen controls.
- **Dynamic Fullscreen & Web Audio Synth**: Enters cinema mode with a single click and synthesizes an ambient romantic waltz (*Fmaj7 → C → G → Am*) alongside realistic physics sound effects (polaroid desk drop thud & timeline slide chime) using the native Web Audio API — without external MP3 files.

---

## 🎨 Design System • نظام التصميم

| Token | Value | Purpose |
| :--- | :--- | :--- |
| **Soft Pink Gradients** | `#FFF5F7` → `#FDECEF` → `#FCE4EC` | Bridal romantic canvas with subtle linen/grain overlays |
| **Rose Gold Accents** | `#D4AF37`, `#F2D98D`, `#B89335` | Gold shimmer typography, metallic badges, soundwave visualizers |
| **Blush Highlights** | `#F8BBD0`, `#F48FB1`, `#E57399` | Heart reactions, ambient glow halos, love certificates |
| **Deep Charcoal Text** | `#33272A`, `#4A3B3E` | High-contrast editorial typography replacing typical neon |
| **Polaroid Frames** | `#FFFDF9`, `#FAFAFA` | Vintage washi tape, multi-layered realistic drop shadows |
| **Typography** | `Playfair Display` (Serif) | Editorial headings & romantic vows |
| **Typography** | `Plus Jakarta Sans` | Modern numbers, UI tags & HUD indicators |
| **Typography** | `Caveat` (Cursive) | Realistic handwritten polaroid border notes |

---

## 🎬 The 5 Cinematic Scenes • المشاهد الخمسة

### 0️⃣ Scene 0: The "Anti-Website" Intro (Fullscreen API)
- Minimalist high-fashion editorial entry screen.
- Sleek glassmorphic button: **"Enter the Experience" (ابدأ الرحلة)**.
- Triggers browser `requestFullscreen()` and initializes the Web Audio ambient synthesizer.

### 1️⃣ Scene 1: The "Wrapped" Stats (Smooth Cascade Reveal)
- Spring-animated massive counter revealing **1,245 Days of Pure Devotion**.
- Cascading Framer Motion staggers across title, counter, and 3 glassy stat cards (`29,880 Hours`, `100% Devotion`, `Infinite Adventures`).
- Pulsing prompt: *"Press Down Arrow or Scroll (اضغط السهم للأسفل)"*.

### 2️⃣ Scene 2: The Cinematic Timeline (Sequential Side-by-Side Reveal)
- Pressing forward reveals memories **ONE BY ONE** with gliding entrance physics.
- Each keystroke docks an editorial memory card beside the previous ones to dynamically compose a panoramic timeline.
- Includes location pins, bilingual Arabic/English titles, and custom milestone badges.

### 3️⃣ Scene 3: The Dynamic Polaroid Desk (Physical Album Feel)
- Starts with an empty virtual scrapbook linen desk.
- Each arrow keystroke physically **drops** a new polaroid from the top of the screen (`y: -800 → dropY`) with bouncy spring physics (`type: "spring", stiffness: 180, damping: 14`), realistic thud audio SFX, and random rotation.
- **Interactive Dragging**: Click and drag any dropped polaroid across the table to curate your own collage.
- **Hover Straighten**: Hovering any polaroid magnifies it (`scale: 1.22`), straightens it (`rotate: 0`), and brings it to `z-index: 999`.

### 4️⃣ Scene 4: The Grand Finale (Love Certificate & Confetti)
- The climactic Spotify Wrapped shareable receipt:
  - Couple names: **Sophia & Julian**.
  - Romantic persona: **Golden Hour Soulmates** (100% Devotion score).
  - Automatic celebration **Rose Petal & Gold Foil Confetti Explosion** via `canvas-confetti`.
  - Share film card button (with clipboard toast) and replay controller.

---

## ⌨️ Interactive Controls • أزرار التحكم

| Control | Function |
| :--- | :--- |
| **`Arrow Down` / `Arrow Right` / `Space`** | Reveal next memory / drop polaroid / advance scene |
| **`Arrow Up` / `Arrow Left`** | Step back to previous memory or previous scene |
| **Mouse Wheel Down / Up** | Fluid debounced progression between film beats |
| **Mouse Drag on Polaroids** | Pick up and arrange dropped polaroids anywhere on the desk |
| **HUD Scene Buttons** | Direct jump between `00 Intro`, `01 Stats`, `02 Timeline`, `03 Desk`, `04 Finale` |
| **HUD Music Pill** | Real-time toggle for the ambient harmonic waltz synthesizer |
| **HUD Fullscreen Pill** | Toggle cinema fullscreen mode |

---

## 🛠️ Tech Stack • التقنيات المستخدمة

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom romantic color tokens and shadows
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (`AnimatePresence`, `useSpring`, `useTransform`, spring physics)
- **Audio Engine**: Native **Web Audio API** (Procedural chord arpeggiator & physical drop SFX)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started • طريقة التشغيل

### 1. Clone the repository
```bash
git clone https://github.com/mazharzaka/karam.git
cd karam
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your desktop browser and click **"Enter the Experience (ابدأ الرحلة)"**.

### 4. Build for Production
```bash
npm run build
npm run start
```
