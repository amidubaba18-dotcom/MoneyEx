// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Your new "Hi Ben" inspo palette
        'brand-bg': '#F0F4FF', // The soft blue/white background
        'slate-900': '#0F172A',
        'slate-800': '#1E293B',
        'slate-600': '#475569',
        'slate-400': '#94A3B8',
        'slate-200': '#E2E8F0',
        'slate-100': '#F1F5F9',
        'cyan-500': '#06B6D4', // Income / Positive
        'orange-500': '#FB923C', // Expense / Negative
        'green-500': '#22C55E', // For percentage increases (+2.10%)
        'red-500': '#EF4444',   // For percentage decreases
      }
    },
  },
  plugins: [],
}