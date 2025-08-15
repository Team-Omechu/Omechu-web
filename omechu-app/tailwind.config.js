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
      fontFamily: {
        sans: ["var(--font-noto-sans-kr)", "sans-serif"],
      },
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
      // Toast 관련 좌우 흔들리는 애니메이션 추가
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-1px)" },
          "40%": { transform: "translateX(1px)" },
          "60%": { transform: "translateX(-1px)" },
          "80%": { transform: "translateX(1px)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
      colors: {
        primary: {
          light: "#ffeded",
          lightHover: "#fee3e3",
          lightActive: "#fec6c6",
          normal: "#ff7676",
          normalHover: "#e2403f",
          normalActive: "#c93938",
          dark: "#bc3535",
          darkHover: "#972b2a",
          darkActive: "#71201f",
          darker: "#581919",
        },
        secondary: {
          light: "#e9f5fb",
          lightHover: "#ddf0f9",
          lightActive: "#bae0f4",
          normal: "#1f9bda",
          normalHover: "#DD6362",
          normalActive: "#197cae",
          dark: "#1774a4",
          darkHover: "#135d83",
          darkActive: "#0e4662",
          darker: "#0b364c",
        },
        main: {
          light: "#fefbff",
          lightHover: "#fef9ff",
          lightActive: "#fdf2ff",
          normal: "#f8d5ff",
          normalHover: "#dfc0e6",
          normalActive: "#c6aacc",
          dark: "#baa0bf",
          darkHover: "#958099",
          darkActive: "#706073",
          darker: "#574b59",
        },
        grey: {
          light: "#f6f6f6",
          lightHover: "#f1f1f1",
          lightActive: "#e2e2e2",
          normal: "#a3a3a3",
          normalHover: "#e2e2e2",
          normalActive: "#828282",
          dark: "#7a7a7a",
          darkHover: "#97948F",
          darkActive: "#494949",
          darker: "#393939",
        },
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

// 25.07.14
// 이삭 - keyframes 및 animation-shake 추가
