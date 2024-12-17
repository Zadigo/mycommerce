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
        } catch (e) {
            console.error('Backend authentication failed', e)
            throw e
        }
    }

    async function signInWithGoogle (callback?: () => void) {
        if (!googleProvider.value) {
            await initGoogleAuth()
        }

        try {
            const { signInWithPopup } = await import('firebase/auth')
            const result = await signInWithPopup($auth as Auth, googleProvider.value!)

            // Get the ID token
            const idToken = await result.user.getIdToken()

            // Send token to Django backend
            await authenticateWithBackend(idToken)

            user.value = result.user
            
            if (callback && typeof callback === 'function') {
                callback()
            }

            return result.user
        } catch (e) {
            error.value = e
            throw e
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
        } catch (e) {
            console.error('Logout failed', e)
        }
    }

    return {
        signInWithGoogle,
        logout,
        user,
        error
    }
}
