import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
      primary   : "#F472B6" ,
      },
      fontSize: {
        'h1': '2.25rem', // 36px
        'h2': '1.875rem', // 30px
        'h3': '1.5rem', // 24px
        'p': '1rem', // 16px
      }
    },
  },
  plugins: [],
} satisfies Config;
