import { Toast } from '@capacitor/toast';
import type { AxiosError } from 'axios';
import { ref } from 'vue';

import axios from 'axios';

interface ErrorContext {
    message: string
    code?: string
    type: 'warning' | 'error' | 'info'
}

export function useErrorHandler () {

    // Global error state (optional, can be used for error logging or global error display)
    const globalError = ref<ErrorContext | null>(null)

    // Utility for logging errors to a service
    function logErrorToService(_error: AxiosError) {
        // Implementation depends on your error logging service
        // Could be Sentry, LogRocket, custom backend endpoint, etc.
    }

    // Specific error type handlers
    function handleBadRequest (error: AxiosError) {
        const errorMessage = error.response?.data?.message || 'Invalid request'

        Toast.show({
            text: errorMessage
        })

        globalError.value = {
            message: errorMessage,
            type: 'warning'
        }
    }

    function handleUnauthorized (_error: AxiosError) {
        // Potential redirect to login or token refresh
        Toast.show({
            text: 'Unauthorized'
        })

        // Example of potential logout and redirect
        // const authStore = useAuthentication()
        // authStore.logout()
        // navigateTo('/login')
    }

    function handleForbidden (_error: AxiosError) {
        Toast.show({
            text: 'You do not have permission to perform this action'
        })
    }

    function handleNotFound (_error: AxiosError) {
        Toast.show({
            text: 'The requested resource could not be found'
        })
    }

    function handleServerError (error: AxiosError) {
        // Log to error tracking service
        logErrorToService(error)

        Toast.show({
            text: 'An unexpected error occurred. Our team has been notified'
        })
    }

    function handleGenericError (error: Error) {
        Toast.show({
            text: error.message
        })
    }

    function handleUnknownError (error: unknown) {
        Toast.show({
            text: 'An unknown error occurred'
        })

        // Potentially log the entire error object for debugging
        console.error('Unhandled error:', error)
    }

    function handleError(error: unknown) {
        // Type guard to check if it's an Axios error
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError

            // Different handling based on error status
            switch (axiosError.response?.status) {
                case 400:
                    handleBadRequest(axiosError)
                    break
                case 401:
                    handleUnauthorized(axiosError)
                    break
                case 403:
                    handleForbidden(axiosError)
                    break
                case 404:
                    handleNotFound(axiosError)
                    break
                case 500:
                    handleServerError(axiosError)
                    break
                default:
                    handleGenericError(axiosError)
            }
        } else if (error instanceof Error) {
            // Handle standard JavaScript errors
            handleGenericError(error)
        } else {
            // Catch-all for unexpected error types
            handleUnknownError(error)
        }
    }

    return {
        handleError,
        globalError
    }
}
