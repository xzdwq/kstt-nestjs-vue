const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: [
    './index.html',
    './public/index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: {
          primary: 'var(--bg-background-primary)',
          secondary: 'var(--bg-background-secondary)',
          tertiary: 'var(--bg-background-tertiary)',
  
          form: 'var(--bg-background-form)',
        },
        copy: {
          primary: 'var(--text-copy-primary)',
          secondary: 'var(--text-copy-secondary)',
          hover: 'var(--text-copy-hover)',
        },
        'border-color': {
          secondary: 'var(--border-border-color-secondary)',
          primary: 'var(--border-border-color-primary)',
        },
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000',
        white: '#fff',
        indigo: {
          400: colors.indigo['400'], //class="text-indigo-400"
          450: '#202e78' //class="text-indigo-450"
        },
      },
      keyframes: {
        'swing': {
          '0%,100%' : { transform: 'rotate(10deg)' },
          '50%' : { transform: 'rotate(-10deg)' },
        }
      },
      animation: {
        'swing': 'swing 1.5s infinite'
      },
      minWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      width: {
        'header-link': '90px'
      },
      maxWidth: {
        '11/12': '97%'
      },
      maxHeight: {
        '11/12': '97%'
      }
    },
    container: {
      center: true,
      padding: '1rem'
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
