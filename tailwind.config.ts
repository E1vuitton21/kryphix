import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Clean Bright White Cyberpunk Palette
        cyber: {
          white: '#FFFFFF',
          slate: '#F8FAFC',
          gray: '#F1F5F9',
          dark: '#0F172A',
          muted: '#475569',
          border: '#E2E8F0',
          cyan: '#00D2FF',
          'cyan-glow': 'rgba(0, 210, 255, 0.25)',
          pink: '#FF007F',
          'pink-glow': 'rgba(255, 0, 127, 0.25)',
          purple: '#7928CA',
          'purple-glow': 'rgba(121, 40, 202, 0.25)',
          amber: '#FFB800',
          'amber-glow': 'rgba(255, 184, 0, 0.25)',
          mint: '#00E676',
          'mint-glow': 'rgba(0, 230, 118, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'monospace'],
      },
      boxShadow: {
        'cyber-cyan': '0 0 20px -3px rgba(0, 210, 255, 0.35)',
        'cyber-pink': '0 0 20px -3px rgba(255, 0, 127, 0.35)',
        'cyber-purple': '0 0 20px -3px rgba(121, 40, 202, 0.35)',
        'cyber-amber': '0 0 20px -3px rgba(255, 184, 0, 0.35)',
        'card-hover': '0 10px 25px -5px rgba(0, 210, 255, 0.18)',
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(#E2E8F0 1px, transparent 1px)",
      },
      backgroundSize: {
        'cyber-grid': '24px 24px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

