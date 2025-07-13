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
      // Toast 관련
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
