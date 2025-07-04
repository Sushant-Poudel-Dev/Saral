/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        lexend: ["var(--font-lexend)", "system-ui", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        roboto: ["var(--font-roboto)", "system-ui", "sans-serif"],
      },
      colors: {
        // Custom color palette
        mint: "#BBEDC2",
        coral: "#FBA69D",
        plum: "#553E4E",
        honey: "#F2C969",
        sky: "#A6E5F2",
        cream: "#F5F5F5",

        primary: "#553E4E",
        secondary: "#BBEDC2",
        accent: "#F2C969",
        highlight: "#FBA69D",
        info: "#A6E5F2",
        background: "#F5F5F5",
      },
    },
  },
};
