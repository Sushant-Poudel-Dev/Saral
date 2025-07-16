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
        // Custom color palette with proper names
        green: "#BBEDC2", // #BBEDC2 → Green
        pink: "#FBA69D", // #FBA69D → Pink
        darkblue: "#553E4E", // #553E4E → Dark Blue
        yellow: "#F2C969", // #F2C969 → Yellow
        blue: "#A6E5F2", // #A6E5F2 → Blue
        honey: "#dcb760", // #dcb760 → Honey

        // Keep the old names for backward compatibility
        mint: "#BBEDC2",
        coral: "#FBA69D",
        plum: "#553E4E",
        sky: "#A6E5F2",
        cream: "#F5F5F5",

        // Semantic colors
        primary: "#553E4E", // Dark Blue
        secondary: "#BBEDC2", // Green
        accent: "#dcb760", // Honey
        highlight: "#FBA69D", // Pink
        info: "#A6E5F2", // Blue
        warning: "#F2C969", // Yellow
        background: "#F5F5F5",
      },
    },
  },
  plugins: [],
};
