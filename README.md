# 🌸 Aura Seasonal Planner | Premium Next.js Calendar

Aura is a high-end, responsive seasonal calendar component built with Next.js and vanilla CSS modules. It mimics the aesthetic of a physical premium wall calendar, offering a dynamic user experience that shifts its visual identity, imagery, and ambient effects based on the current month and season.

![Calendar Showcase](https://github.com/VaishaleeSingh/Calendar/raw/master/public/assets/spring.png)

## 🎨 Key Features

### 1. Dynamic Seasonal Design System
The entire UI automatically adapts to the four seasons (Spring, Summer, Autumn, Winter).
- **Seasonal Hero Imagery**: High-quality, AI-generated seasonal hero images for each period.
- **28+ CSS Color Tokens**: Gradients, glows, highlights, and text colors update dynamically via data-attributes.
- **Ambient Particle Canvas**: Animated floating elements (butterflies/blossoms for Spring, snowflakes for Winter, etc.) using HTML5 Canvas API.

### 2. Comprehensive Navigation & Utilities
- **Month/Year Dropdowns**: Quick navigation through a sleek custom dropdown system.
- **Real-Time Weather Context**: Live-updating situational weather labels per season.
- **Sunday Holiday Highlights**: Sundays are visually distinct with a soft coral-red tint across both the column header and the date grid.
- **Today Marker**: A pulsing dot under the current day for instant orientation.

### 3. Smart Information Management
- **Holiday Database**: Built-in, year-specific holidays for 2024–2026 (Indian National, Regional, and International).
- **Persistent Note-Taking**: LocalStorage-based storage for both Monthly Memos and Day-Specific Notes.
- **Persistent Notes List**: A sidebar list that shows all your saved notes globally, allowing you to edit or delete any record at once.
- **Interactive Range Selection**: Two-click range selection with hover-previews and specialized start/end animations.

### 4. Technical Architecture
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS Modules (No Tailwind, maximum design precision)
- **Animation**: Framer Motion for hero transitions and layout shifts
- **Date Management**: date-fns for robust calendar logic
- **Icons**: Lucide React for consistent iconography

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗 Project Structure
- `src/components/Calendar/`: Core folder containing `Calendar.js` logic and `Calendar.module.css` local styles.
- `src/app/globals.css`: Contains the seasonal CSS variables and root design tokens.
- `public/assets/`: Seasonal hero images (spring.png, summer.png, etc.).

## 📱 Responsive Layout
The Aura Calendar is fully responsive:
- **Desktop (1024px+)**: Side-by-side view with a hero on the left and input grid/notes on the right.
- **Mobile (< 1024px)**: Elegant vertical stack ensuring touch-friendly interactions on smaller viewports.

---
Built with ❤️ by [Vaishalee Singh](https://github.com/VaishaleeSingh)
