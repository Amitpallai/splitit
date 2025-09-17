import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // scan all JS/TS/React files
  ],
  theme: {
    extend: {
      colors: {
        // optional: custom colors
        primary: '#6B21A8',
        secondary: '#1F2937',
      },
    },
  },
  plugins: [],
};

export default config;
