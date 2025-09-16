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
        inter: ['var(--font-inter)', 'Inter', 'Yu Gothic', 'Hiragino Sans', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'Poppins', 'Yu Gothic', 'Hiragino Sans', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
        sans: ['var(--font-inter)', 'Inter', 'Yu Gothic', 'Hiragino Sans', 'system-ui', 'sans-serif'],
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
            fontFamily: theme('fontFamily.inter'),
            fontWeight: '400',
            lineHeight: '1.7',
            letterSpacing: '0.025em',
            h1: {
              fontFamily: theme('fontFamily.poppins'),
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            h2: {
              fontFamily: theme('fontFamily.poppins'),
              fontWeight: '500',
              letterSpacing: '-0.025em',
            },
            h3: {
              fontFamily: theme('fontFamily.poppins'),
              fontWeight: '500',
              letterSpacing: '-0.01em',
            },
            h4: {
              fontFamily: theme('fontFamily.poppins'),
              fontWeight: '500',
            },
            h5: {
              fontFamily: theme('fontFamily.poppins'),
              fontWeight: '500',
            },
            h6: {
              fontFamily: theme('fontFamily.poppins'),
              fontWeight: '500',
            },
            code: {
              fontFamily: theme('fontFamily.mono'),
            },
            'pre code': {
              fontFamily: theme('fontFamily.mono'),
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