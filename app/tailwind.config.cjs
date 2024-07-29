/* eslint-disable no-undef */

const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          // Tell the plugin to not add any classes to anchor tags
          // since we always use the Link component which is styled already.
          css: { a: false },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      // Overwrite `gray` as `zinc`, disable all other gray to remove autocomplete
      colors: {
        gray: colors.zinc,
        slate: null,
        zinc: null,
        neutral: null,
        stone: null,
      },
    },
    // fontFamily: {
    //   sans: ['', 'Segoe UI', 'Tahoma', 'sans-serif'],
    // },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
