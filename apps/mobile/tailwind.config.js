/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark theme colors based on Figma
        dark: {
          bg: '#0F0F0F',
          'bg-secondary': '#1F1F1F',
          border: '#2D2D2D',
          text: '#FFFFFF',
          'text-secondary': '#A0AEC0',
        },
        // Brand colors
        brand: {
          purple: '#7C3AED',
          gold: '#F59E0B',
          red: '#EF4444',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      borderRadius: {
        card: '12px',
        button: '8px',
      },
    },
  },
  plugins: [],
};
