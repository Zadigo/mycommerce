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
