// /** @type {import('tailwindcss').Config} */
// import PrimeUI from "tailwindcss-primeui";

export default {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue',
        './nuxt.config.{js,ts}'
    ],
    theme: {
        extend: {
            fontFamily: {},
            colors: {},
            screens: {},  
        },
    },
    // plugins: [PrimeUI],
    darkMode: 'class',
}
