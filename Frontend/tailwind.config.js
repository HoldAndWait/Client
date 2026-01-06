/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // 이 경로에서 Tailwind가 클래스명을 적용
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}