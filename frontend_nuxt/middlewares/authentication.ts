import { useAuthentication } from "~/stores/useAuthentication"

export default defineNuxtRouteMiddleware((to, _from) => {
   const store = useAuthentication()
   
   if (to.path.startsWith('/accounts/')) {
    if (!store.isAuthenticated) {
        navigateTo('/')
    }
   }
})
