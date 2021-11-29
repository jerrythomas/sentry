const colors = require('tailwindcss/colors')
const config = {
  mode: 'aot',
  purge: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      cursive: ['Kalam', 'cursive'],
      serif: ['Montserrat Alternates', 'ui-serif', 'sans-serif'],
      body: ['Montserrat Alternates', 'ui-serif', 'sans-serif'],
    },
    fontSize: {
      xxl: '10rem',
    },
    extend: {
      colors: {
        pass: colors.emerald,
        fail: colors.rose,
        warn: colors.yellow,
        info: colors.sky,
        // accent: colors.orange,
        primary: colors.blueGray,
        accent: {
          DEFAULT: '#DD845D',
          50: '#FDF7F5',
          100: '#F9EAE4',
          200: '#F2D1C2',
          300: '#EBB7A0',
          400: '#E49E7F',
          500: '#DD845D',
          600: '#D76E3F',
          700: '#C95A2A',
          800: '#AB4D24',
          900: '#8E401E',
        },
        slate: {
          DEFAULT: '#A7A7A7',
          50: '#FFFFFF',
          100: '#FAFAFB',
          200: '#F4F4F6',
          300: '#EBB7A0',
          400: '#E49E7F',
          500: '#A7A7A7',
          600: '#D76E3F',
          700: '#C95A2A',
          800: '#AB4D24',
          900: '#8E401E',
        },
      },
      backgroundImage: (theme) => ({
        texture: "url('/subtle-grey.png')",
      }),
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}

module.exports = config
