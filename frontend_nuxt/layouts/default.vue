<template>
  <div class="container">
    <slot />

    <v-navigation-drawer v-model="shouldShowLoginDrawer" location="right" temporary>
      <v-btn @click="proxyLogin">
        Login 
      </v-btn>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const store = useAuthentication()
const { showLoginDrawer } = storeToRefs(store)

const { testLogin } = useAuthencationComposable()

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
