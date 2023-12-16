/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        opening:  {
          '0%': { 
            backgroundColor: "#0000004f",
            opacity: 0
        
           },
          '100%': {  backgroundColor: "#0000004f",
          opacity: 1
        },
        }
      },
      animation: {
        'modal-open': 'opening 0.2s forwards 1',
      }

    },
  },
  plugins: [],
}

