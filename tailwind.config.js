/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page:    '#F5F6FA',
        panel:   '#FFFFFF',
        card: {
          DEFAULT: '#FFFFFF',
          hover:   '#F0F4FF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          strong:  '#D1D5DB',
        },
        primary:   '#131313',
        secondary: '#6B7280',
        muted:     '#9CA3AF',
        accent: {
          DEFAULT: '#002CCD',
          dark:    '#0022AA',
        },
        critical: '#DC2626',
        high:     '#EA580C',
        medium:   '#D97706',
        low:      '#0891B2',
        info:     '#2563EB',
        success:  '#16A34A',
      },
      spacing: {
        sidebar: '220px',
        topbar:  '56px',
      },
      boxShadow: {
        card:     '0 1px 3px rgba(0,0,0,0.08)',
        elevated: '0 4px 12px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
