// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dmserif: ['"DM Serif Text"', 'serif'],
      },
      backgroundImage: {
      'light': "url('/bg-light.png')",
      'dark': "url('/bg-dark.png')",
     }
    },
  },
  darkMode: 'class',
  plugins: [],
}
