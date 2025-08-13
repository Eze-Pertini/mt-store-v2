

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#00AEEF",
          dark: "#008CBF",
          light: "#33CFFF",
        },
        background: "#0D1117",
        surface: "#1B1F24",
        text: {
          primary: "#FFFFFF",
          secondary: "#A1A1AA",
        },
        accent: "#7B61FF",
        success: "#00C48C",
        warning: "#F9A825",
        danger: "#E53935",
      }
    }
  },
  plugins: [],
};
