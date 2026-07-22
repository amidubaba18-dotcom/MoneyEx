/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // We can define our minimal palette here later
        background: '#f8f8f8',
        surface: '#ffffff',
        primary: '#000000',
        text: '#1a1a1a',
        muted: '#8e8e93',
      }
    },
  },
  plugins: [],
}