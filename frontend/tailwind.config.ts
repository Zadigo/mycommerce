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
            colors: {
                'warning': 'hasl(var(--warning))',
                'warning-foreground': 'hasl(var(--warning-foreground))',
                'info': 'hasl(var(--info))',
                'info-foreground': 'hasl(var(--info-foreground))',
                'light': 'hasl(var(--light))',
                'light-foreground': 'hasl(var(--light-foreground))'
            },
            screens: {},  
        },
    },
    darkMode: 'class'
}
