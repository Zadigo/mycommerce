<template>
  <v-app>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script lang="ts" setup>
import { useSessionStorage } from '@vueuse/core';
import type { CartUpdateAPIResponse, Profile } from './types';

const serializer = {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    },
  }

const profile = useSessionStorage<Profile>('profile', null, { serializer })
const cart = useSessionStorage<CartUpdateAPIResponse>('cart', null, { serializer })

const authenticationStore = useAuthentication()
const cartStore = useCart()

const accessToken = useCookie('access')
const refreshToken = useCookie('refresh')

onMounted(() => {
  authenticationStore.accessToken = accessToken.value
  authenticationStore.refreshToken = refreshToken.value
  authenticationStore.profile = profile.value
  cartStore.cache = cart.value
})
</script>
