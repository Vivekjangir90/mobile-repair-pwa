/** @type {import('tailwindcss').Config} */
module.exports = {
  // Yeh configure karta hai ki Tailwind kin files mein classes khojega
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Apne project ke liye custom primary color define karein
      colors: {
        'primary-indigo': '#4f46e5', // Ya koi aur shade jo aapke brand ko suit kare
        'secondary-green': '#10b981', 
      },
      // Screens ko adjust karein agar zaroorat ho (Mobile-first approach ke liye)
      screens: {
        'xs': '475px', // Extra small mobile screens
      },
    },
  },
  plugins: [
    // Agar aap forms aur buttons ko behtar styling dena chahte hain
    require('@tailwindcss/forms'),
  ],
}
