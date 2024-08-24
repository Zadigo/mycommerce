<template>
  <section class="error-page bg-light text-dark d-flex justify-content-center align-items-center text-center">
    <div class="container">
      <h1 class="mb-1 fw-bold">404</h1>
      <h2 class="h4 mb-5">Page not found</h2>
      <v-btn :to="{ name: 'shop_collections' }" color="secondary" size="x-large" rounded>
        Go to shop
      </v-btn>
    </div>
  </section>
</template>

<style scoped>
.error-page {
  position: relative;
  width: 100%;
  height: 100vh;
}
h1 {
  font-size: 11rem;
}
</style>
