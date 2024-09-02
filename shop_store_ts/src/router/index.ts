import { useAuthentication } from 'stores/authentication'
import { createRouter, createWebHistory, isNavigationFailure } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  scrollBehavior: () => ({ top: 0, left: 0 }),
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const store = useAuthentication()

  if (to.meta.requiresAuthentication) {
    if (!store.isAuthenticated) {
      next({
        name: 'shop_collections',
        query: {
          login: 0
        }
      })
      return 
    }
  }
  next()
})

router.afterEach((to, from, failure) => {
  if (isNavigationFailure(failure)) {
    // Do something
    console.log('navigation failure', failure, to, from)
  }
})

router.onError((error, to, from) => {
  console.error(error, to, from)
})

export default router
