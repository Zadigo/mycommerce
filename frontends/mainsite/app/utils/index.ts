import type { Undefineable } from '~/types'
import { FetchError } from 'ofetch'

/**
 * Function used to check if the application is in a
 * production environment 
 */
export function inProduction() {
  return process.env.NODE_ENV !== 'development'
}

/**
 * Function used to scroll to the top of the page 
 */
export function scrollToTop() {
  window.scroll({ top: 0, behavior: 'smooth' })
}

/**
 * 
 * @param base The base of the id, usually the component name
 * @param parts The parts to be added to the id, usually the props of the component
 */
export function createElementId(base: string, ...parts: Array<Undefineable<string | number>>): string {
  const _parts = parts.map(p => (p || '').toString().replace(' ', '-')).join('__')
  return `${base}_${_parts}`
}

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

/**
 * Function used to check if an object can be saved
 * @param obj The object to be checked
 */
export function objectCanBeSaved(obj: MaybeRef<Record<string, unknown>>): boolean {
  return Object.entries(toValue(obj)).map(([_, value]) => value !== '').every((val) => val === true)
}
