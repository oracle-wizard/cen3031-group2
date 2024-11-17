/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-', // Add a 'tw-' prefix to all Tailwind classes
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './index.html', // Path to your index.html file in the root
  ], // Adjust based on your project
  theme: {
    extend: {},
  },
  plugins: [],
}

