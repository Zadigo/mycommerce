import type { GoogleAuthProvider, Auth } from 'firebase/auth'

export function useGoogleAuth () {
    const { $auth } = useNuxtApp()

    const googleProvider = ref<GoogleAuthProvider | null>(null)
    const user = ref(null)
    const error = ref(null)

    async function initGoogleAuth () {
        const { GoogleAuthProvider } = await import('firebase/auth')

        googleProvider.value = new GoogleAuthProvider()
        // Optional: Add scopes
        googleProvider.value.addScope('profile')
        googleProvider.value.addScope('email')
    }

    async function authenticateWithBackend(idToken: string) {
        const { $client } = useNuxtApp()

        try {
            const response = await $client.post('/api/auth/google/', {
                id_token: idToken
            })

            // Store authentication details
            const authStore = useAuthentication()
            authStore.setUser(response.data)

            // Optional: Set cookies or local storage
            setCookie('auth_token', response.data.token)
        } catch (err) {
            console.error('Backend authentication failed', err)
            throw err
        }
    }

    async function signInWithGoogle () {
        if (!googleProvider.value) {
            await initGoogleAuth()
        }

        try {
            const { signInWithPopup } = await import('firebase/auth')
            const result = await signInWithPopup($auth, googleProvider.value!)

            // Get the ID token
            const idToken = await result.user.getIdToken()

            // Send token to Django backend
            await authenticateWithBackend(idToken)

            user.value = result.user
            return result.user
        } catch (err) {
            error.value = err
            throw err
        }
    }

    async function logout () {
        try {
            const { signOut } = await import('firebase/auth')
            await signOut($auth)

            // Clear backend session
            const { $client } = useNuxtApp()
            await $client.post('/api/auth/logout/')

            // Clear local state
            const authStore = useAuthentication()
            authStore.clearUser()

            user.value = null
        } catch (err) {
            console.error('Logout failed', err)
        }
    }

    return {
        signInWithGoogle,
        logout,
        user,
        error
    }
}
