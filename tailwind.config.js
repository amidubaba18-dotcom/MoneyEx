/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',   // soft warm off-white (was #f8f8f8)
        surface: '#ffffff',      // cards on top of background stay pure white
        card: '#14161B',         // dark charcoal-navy for balance card (was pure black)
        primary: '#000000',      // keep for buttons/nav if you want true black there
        text: '#1a1a1a',
        muted: '#8e8e93',

        // new: semantic colors for consistent income/expense treatment
        income: '#1FAA59',       // deep green
        incomeSoft: '#E6F7EC',   // soft green tint (for icon circles/backgrounds)
        expense: '#E5484D',      // deep red
        expenseSoft: '#FCEBEC',  // soft red tint

        accent: '#1FAA59',       // pick one accent for links/active states — using income green since it's a finance app
      }
    },
  },
  plugins: [],
}