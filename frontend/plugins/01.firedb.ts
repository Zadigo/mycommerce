import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()
    const app = initializeApp({
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        databaseURL: config.public.firebaseDbUrl,
        storageBucket: config.public.firebaseStorageBucket,
        appId: config.public.firebaseAppId,
        projectId: config.public.firebaseProjectId,
        measurementId: config.public.firebaseMeasurementId,
        messagingSenderId: config.public.firebaseMessageSenderId
    })
    const db = getDatabase(app)

    return {
        provide: {
            fireApp: app,
            fireDb: db
        }
    }
})
