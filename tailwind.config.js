module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#34568B', // Stone blue
        secondary: '#4682B4', // Steel blue
        accent: '#87CEEB', // Sky blue
        background: '#F0F8FF', // Alice blue
        text: '#333333', // Dark gray for text
      },
    },
  },
  plugins: [],
}