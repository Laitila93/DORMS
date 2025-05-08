export default {
  darkMode: "media",
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FDD877',      // Soft amber - for hover states or accents
          DEFAULT: '#FF7F11',    // Vibrant orange - main branding / CTA
          dark: '#B54708',       // Burnt orange - for buttons, bold UI elements
        },
        secondary: {
          light: '#A4C3B2',      // Pale green-gray - subtle backgrounds
          DEFAULT: '#6B9080',    // Muted teal-green - secondary buttons / UI
          dark: '#3A6351',       // Deep forest green - hover/active states
        },
        background: {
          light: '#F0F4EF',      // Very light sage - full-page background
          DEFAULT: '#E4EFE7',    // Clean, soft green-gray - cards and sections
          dark: '#2F3E46',       // Dark slate - for dark mode or footer
        },
        text: {
          light: '#6B9080',      // Soft muted green - secondary/caption text
          DEFAULT: '#2F3E46',    // Slate gray - primary body text
          dark: '#DAD7CD',       // Light sage - readable on dark backgrounds
          headline: '#B54708', // New dark amber - used for headings
        },
        border: {
          DEFAULT: '#D6D3CD',    // Neutral gray - for subtle borders
          dark: '#3A6351',       // Dark green - for strong separations
        },
        accent: {
          DEFAULT: '#FFC857',    // Warm yellow - alerts, highlights, icons
          subtle: '#FBEEDB',     // Pale peach - gentle attention backgrounds
        },
      },
    }, 
  }
}
