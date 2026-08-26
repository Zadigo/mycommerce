import { FetchError } from 'ofetch'

/**
 * Creates a standardized error template based on the provided error object.
 * This function is useful for generating consistent error responses in API handlers. 
 * @param error The error object to generate the template from.
 */
export function createErrorTemplate(error: Error | FetchError | unknown): { statusCode: number; statusMessage: string } {
  const template: Record<string, string | number> = {
    statusCode: 500,
    statusMessage: 'An unknown error occurred'
  }

  if (error instanceof Error) {
    template.statusMessage = error.message
  } else if (error instanceof FetchError) {
    template.statusCode = error.response?.status || 500
    template.statusMessage = error.response?._data?.detail || `${error}`
  }

  return template as { statusCode: number; statusMessage: string }
}
