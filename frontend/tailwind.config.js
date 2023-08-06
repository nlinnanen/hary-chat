/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes : [
      {
        mytheme: {
          primary: "#570df8",  
          secondary: "#f000b8",  
          accent: "#1dcdbc",  
          neutral: "#d1d5db",  
          "base-100": "#ffffff",
          info: "#3abff8",  
          success: "#36d399",  
          warning: "#fbbd23",  
          error: "#f87272",
        }
      },
      "dark"
    ],
    darkTheme: "dark",
  }
}