export default {
  darkMode: "media",
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#B2E3D1', 
          DEFAULT: '#FCAB10', 
          dark: '#00796B',
        },
        secondary: {
          light: '#89B0AE',
          DEFAULT: '#89B0AE', 
          dark: '#89B0AE',
        },
        background: {
          light: '#BEE3DB',  
          DEFAULT: '#BEE3DB', 
          dark: '#3A6351',   
        },
        text: {
          light: '#3A6351',
          DEFAULT: '#2B4570', //Tea green
          dark: '#BEE3DB',
          headline: '#FCAB10', // dark gray
        }
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
