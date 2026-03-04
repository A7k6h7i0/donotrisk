import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101414",
        paper: "#f7f5ef",
        ember: "#c24d2c",
        moss: "#5b7f3a",
        slate: "#304255"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Source Sans 3'", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
