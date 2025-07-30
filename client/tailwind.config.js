import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        ceva: ['Poppins', 'sans-serif'],
        lovers: ['"Lovers Quarrel"', 'cursive'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        nunito: ['"Nunito Sans"', 'sans-serif'],
        work: ['"Work Sans"', 'sans-serif'],
      },},
  },
  darkMode: "class",
  plugins: [heroui()],
}
