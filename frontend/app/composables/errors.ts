import { ref } from 'vue'
import { FetchError } from 'ofetch'

interface ErrorContext {
  message: string
  code?: string
  type: 'warning' | 'error' | 'info'
}

/**
 * Composable for handling errors in a Nuxt 3 application.
 * This provides a structured way to handle different types of errors,
 * log them, and display user-friendly messages to the user.
 */
export function useErrorHandler() {
  if (import.meta.server) {
    return {
      customHandleError: (error: FetchError | Error | unknown) => {
        console.error(error)
      },
      globalError: ref<ErrorContext | null>(null)
    }
  }

  const { $toast } = useNuxtApp()

  // Global error state (optional, can be used for error logging or global error display)
  const globalError = ref<ErrorContext | null>(null)

  function displayToast(title: string, description: string) {
    $toast.error(title, {
      description,
      position: 'top-center'
    })
  }

  // Specific error type handlers
  function handleBadRequest(error: FetchError) {
    const errorMessage = error.message || 'Invalid request'

    displayToast('Bad Request', errorMessage)

    globalError.value = {
      message: errorMessage,
      type: 'warning'
    }
  }

  function handleUnauthorized(_error: FetchError) {
    displayToast('Unauthorized', 'Please log in again')
  }

  function handleForbidden(_error: FetchError) {
    displayToast('Access Denied', 'You do not have permission to perform this action')
  }

  function handleNotFound(_error: FetchError) {
    displayToast('Not Found', 'The requested resource could not be found')
  }
  
  function handleServerError(error: FetchError) {
    displayToast('Server Error', 'An unexpected error occurred. Our team has been notified.')
  }

  function handleGenericError(error: Error) {
    displayToast('Error', error.message)
  }

  function handleUnknownError(error: unknown) {
    displayToast('Unexpected Error', 'An unknown error occurred')
    // Potentially log the entire error object for debugging
    console.error('Unhandled error:', error)
  }

  // Type guard to check if it's a Fetch error
  function customHandleError(error: unknown) {
    if (error instanceof FetchError) {
      switch (error.statusCode) {
        case 400:
          handleBadRequest(error)
          break
        case 401:
          handleUnauthorized(error)
          break
        case 403:
          handleForbidden(error)
          break
        case 404:
          handleNotFound(error)
          break
        case 500:
          handleServerError(error)
          break
        default:
          handleGenericError(error)
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
    /**
     * Handles errors based on their type.
     * This function checks if the error is an instance of FetchError
     * and routes it to the appropriate handler based on the status code.
     * If the error is a standard JavaScript Error, it is handled generically.
     */
    customHandleError,
    /**
     * Global error state that can be used to display or log errors.
     * This can be used in components to show a global error message
     * or for logging purposes.
     */
    globalError
  }
}
