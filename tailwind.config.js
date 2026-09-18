/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        ink: '#0A0A0A',
        paper: '#FAFAF8',
        stone: '#E8E6E1',
        muted: '#8A8886',
      },
      animation: {
        'spin-slow': 'spin 24s linear infinite',
        'spin-slower': 'spin 40s linear infinite',
      }
    },
  },
  plugins: [],
}
