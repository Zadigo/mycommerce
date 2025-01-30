import { initializeApp } from 'firebase/app'
import { getDatabase, ref as dbRef } from 'firebase/database'

// nuxtApp.provide('fireApp', app)
// nuxtApp.provide('fireDb', dbRef(db, 'todos'))

const app = initializeApp({
    apiKey: import.meta.env.firebaseApiKey,
    authDomain: import.meta.env.firebaseAuthDomain,
    databaseURL: import.meta.env.firebaseDatabaseUrl,
    storageBucket: import.meta.env.firebaseStorageBucket,
    appId: import.meta.env.firebaseAppId,
    projectId: import.meta.env.firebaseProjectId,
    measurementId: import.meta.env.firebaseMeasurementId,
    messagingSenderId: import.meta.env.firebaseMessagingSenderId
})

export default function useFirebase () {
    const db = getDatabase(app)

    return {
        app,
        db
    }

}
