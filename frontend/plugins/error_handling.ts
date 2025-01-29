export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        // Handle errors to an external service here
        console.info('errorHandler', error, instance, info)
    }
})
