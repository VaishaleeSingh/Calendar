# Aura Calendar - Premium Wall Calendar Component

A highly interactive, React-based web component inspired by physical wall calendars. Built for responsiveness and a premium user experience.

## ✨ Features

- **Wall Calendar Aesthetic**: Prominent hero image (dynamic per month) serving as a visual anchor.
- **Day Range Selector**: Click to select a start date and an end date. The range is visually highlighted across the grid.
- **Integrated Notes**:
  - **Monthly Memo**: A general notes section for overall monthly goals.
  - **Date-Specific Notes**: Attach detailed notes to specific dates or your selected range.
- **Persistence**: Notes are automatically saved to `localStorage`.
- **Animations**: Smooth "flipping" transitions between months and interactive hover effects using Framer Motion.
- **Fully Responsive**: Graceful transition between desktop (side-by-side) and mobile (stacked) layouts.
- **Modern Tech Stack**: React (Next.js), Vanilla CSS Modules, Lucide Icons, Date-fns.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: Vanilla CSS Modules (no Tailwind for maximum design control)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the component.

## 📁 Project Structure

- `src/components/Calendar`: Main component logic and styling.
- `src/lib/utils.js`: Utility functions.
- `public/assets`: Hero images and static assets.
- `src/app/globals.css`: Global design tokens and resets.

## 🎨 Design Philosophy

The Aura Calendar brand focuses on "serenity and productivity." The UI uses muted gradients, glassmorphism, and a high-contrast date grid to ensure that while the aesthetics are "premium," the functional utility of the calendar remains the top priority.
