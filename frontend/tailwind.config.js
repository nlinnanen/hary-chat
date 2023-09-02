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
        myLight: {
          primary: "#002e7d",  
          secondary: "#0053a0",  
          accent: "#002e7d",  
          neutral: "#37ddc9",  
          "base-100": "#eceff1",
          info: "#3abff8",  
          success: "#9ac31a",  
          warning: "#fbbd23",  
          error: "#f87272",
        },
        myDark: {
          primary: "#002e7d",  
          secondary: "#0053a0",  
          accent: "#35536F",  
          neutral: "#303134",  
          "base-100": "#202124",
          info: "#3abff8",  
          success: "#36d399",  
          warning: "#fbbd23",  
          error: "#f87272",
        },
      },
    ],
    darkTheme: "myDark",
  }
}