export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // Main buttons, navigation highlights, active tabs, links, interactive elements
        primary: { DEFAULT: '#005A9C', dark: '#004A80' },
        // Header, sidebar, headings, footer, important text
        secondary: { DEFAULT: '#1B365D', dark: '#132848' },
        // Accent = icons, illustrations, decorative. Light = soft backgrounds, selected cards, notifications
        accent: { DEFAULT: '#60C1E5', light: '#A0E0EF', soft: '#EAF7FB' },
        surface: '#F4F8FC',
        ink: '#1B365D',
        muted: '#56677F',
        line: '#DCE4EE',
        success: { DEFAULT: '#1F7A52', light: '#C9EEDB' },
        danger: { DEFAULT: '#B42318', light: '#FEE4E2' },
        warning: { DEFAULT: '#8A4B0B', light: '#FDE3B5' },
        periwinkle: { DEFAULT: '#3A3F8F', light: '#C9CFF7' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
