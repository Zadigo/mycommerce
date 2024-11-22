<template>
  <section class="site">
    <!-- Navbar -->
    <BaseNavbar />

    <div class="container-fluid">
      <slot />

      <!-- Modals -->
      <ModalsLogin />
    </div>
  </section>
</template>

<script lang="ts" setup>
const store = useAuthentication()
const accessToken = useCookie('access')
const refreshToken = useCookie('refresh')

onMounted(() => {
  store.accessToken = accessToken.value
  store.refreshToken = refreshToken.value
})
</script>
