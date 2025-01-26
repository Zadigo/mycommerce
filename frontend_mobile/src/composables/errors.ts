import { ref } from 'vue'
import type { AxiosError } from 'axios'

import axios from 'axios'

interface ErrorContext {
    message: string
    code?: string
    type: 'warning' | 'error' | 'info'
}

export function useErrorHandler (toast) {
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

        toast.error('Bad Request', {
            description: errorMessage
        })

        globalError.value = {
            message: errorMessage,
            type: 'warning'
        }
    }

    function handleUnauthorized (_error: AxiosError) {
        // Potential redirect to login or token refresh
        toast.error('Unauthorized', {
            description: 'Please log in again'
        })

        // Example of potential logout and redirect
        // const authStore = useAuthentication()
        // authStore.logout()
        // navigateTo('/login')
    }

    function handleForbidden (_error: AxiosError) {
        toast.error('Access Denied', {
            description: 'You do not have permission to perform this action'
        })
    }

    function handleNotFound (_error: AxiosError) {
        toast.error('Not Found', {
            description: 'The requested resource could not be found'
        })
    }

    function handleServerError (error: AxiosError) {
        // Log to error tracking service
        logErrorToService(error)

        toast.error('Server Error', {
            description: 'An unexpected error occurred. Our team has been notified.'
        })
    }

    function handleGenericError (error: Error) {
        toast.error('Error', {
            description: error.message
        })
    }

    function handleUnknownError (error: unknown) {
        toast.error('Unexpected Error', {
            description: 'An unknown error occurred'
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
