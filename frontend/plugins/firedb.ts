import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const app = initializeApp({
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        databaseURL: config.public.firebaseDatabaseUrl,
        storageBucket: config.public.firebaseStorageBucket,
        appId: config.public.firebaseAppId,
        projectId: config.public.firebaseProjectId,
        measurementId: config.public.firebaseMeasurementId,
        messagingSenderId: config.public.firebaseMessagingSenderId
    })
    const db = getDatabase(app)

    nuxtApp.provide('fireApp', app)
    nuxtApp.provide('fireDb', db)
})
