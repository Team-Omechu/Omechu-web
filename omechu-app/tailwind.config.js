/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        mobile: { max: "375px" },
        // 필요 시 추가 정의 가능
      },
      maxWidth: {
        "screen-mobile": "375px",
      },
      minHeight: {
        "screen-mobile": "812px",
      },
    },
  },

  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* For Chrome, Safari, Opera */
          "&::-webkit-scrollbar": {
            display: "none",
          },
          /* For IE, Edge, Firefox */
          "-ms-overflow-style": "none", // IE and Edge
          "scrollbar-width": "none", // Firefox
        },
      });
    },
  ],
};
