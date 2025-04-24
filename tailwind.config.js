export default {
  darkMode: "media",
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#B2E3D1',  // soft mint
          DEFAULT: '#FCAB10', // eco teal
          dark: '#00796B',    // deeper aqua green
        },
        secondary: {
          light: '#89B0AE',  // gentle sky blue
          DEFAULT: '#89B0AE', // water blue
          dark: '#89B0AE',    // deeper blue
        },
        background: {
          light: '#BEE3DB',  
          DEFAULT: '#BEE3DB', 
          dark: '#3A6351',   
        },
        text: {
          light: '#3A6351',   // neutral gray
          DEFAULT: '#2B4570', //Tea green
          dark: '#BEE3DB',
        },
      },
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        nunito: ['"Nunito Sans"', 'sans-serif'],
        sans: ['"Nunito Sans"', 'sans-serif'], // Set as default if desired
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.5rem',
      },
    },
  },
  plugins: [],
}
