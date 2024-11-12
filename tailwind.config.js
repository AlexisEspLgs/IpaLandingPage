module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D3D8B', // Stone blue
        secondary: '#162755', // Steel blue
        accent: '#1B52DA', // Sky blue
        background: '#EFF6FF', // Alice blue
        text: '#333333', // Dark gray for text
      },
    },
  },
  plugins: [],
}