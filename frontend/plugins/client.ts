import createDjangoClient from '~/composables/django_client'

export default defineNuxtPlugin(nuxtApp => {
    // Provide a specific client built to work
    // with the Django backend specifically
    const client = createDjangoClient('/api/v1/')
    nuxtApp.provide('client', client)
})
