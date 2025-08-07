import type { NavigationGuard } from 'vue-router'

/**
 * Middle ware mainly to run certain functions on the
 * product page before the route is entered 
 */
export default defineNuxtRouteMiddleware((to): ReturnType<NavigationGuard> => {
  if (import.meta.server) return
  return true
})
