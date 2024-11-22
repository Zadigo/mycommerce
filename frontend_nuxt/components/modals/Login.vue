
<template>
  <ModalsBase v-model="shouldShowLoginDrawer">
    <v-btn @click="proxyLogin">
      Login 
    </v-btn>
  </ModalsBase>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const store = useAuthentication()

const { testLogin } = useAuthencationComposable()
const { showLoginDrawer } = storeToRefs(store)

const shouldShowLoginDrawer = computed<boolean>({
  get: () => {
    return route.query.login === '0' || showLoginDrawer.value
  },
  set: (value: boolean) => {
    showLoginDrawer.value = value
  }
})

function proxyLogin () {
  testLogin(() => {
    const newQuery = { ...route.query, login: '1' }

    store.accessToken = 'test token'
    store.refreshToken = 'test token'
    
    router.replace({ query: newQuery })

    shouldShowLoginDrawer.value = false
  })
}
</script>
