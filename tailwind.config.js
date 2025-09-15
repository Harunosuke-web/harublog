/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Yu Gothic', 'Hiragino Sans', 'system-ui', 'sans-serif'],
        japanese: ['Yu Gothic', 'Hiragino Sans', 'Meiryo', 'sans-serif'],
      },
      fontWeight: {
        'extra-light': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.sans'),
            fontWeight: '400',
            lineHeight: '1.7',
            letterSpacing: '0.025em',
            h1: {
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            h2: {
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            h3: {
              fontWeight: '500',
              letterSpacing: '-0.01em',
            },
            h4: {
              fontWeight: '500',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};