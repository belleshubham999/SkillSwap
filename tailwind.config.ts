import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--bg))',
        fg: 'hsl(var(--fg))',
        muted: 'hsl(var(--muted))',
        primary: 'hsl(var(--primary))',
        border: 'hsl(var(--border))',
        card: 'hsl(var(--card))'
      },
      borderRadius: { lg: '0.75rem', xl: '1rem' }
    }
  },
  plugins: []
} satisfies Config;
