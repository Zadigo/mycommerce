<template>
  <section id="shop" class="position-relative">
    <!-- Navbar -->
    <BaseNavbar />

    <div class="container-fluid">
      <slot />

      <!-- Modals -->
      <ModalsLogin />
    </div>

    <!-- Footer -->
    <BaseFooter />
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
