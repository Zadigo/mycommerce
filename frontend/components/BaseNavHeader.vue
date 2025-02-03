<template>
  <div class="nav-header shadow-sm" style="z-index: 1000;">
    <slot />

    <header class="py-3 mb-4 bg-white">
      <div class="container d-flex flex-wrap justify-content-center">
        <NuxtLink to="/" class="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
          <span class="fs-4">
            E-commerce
          </span>
        </NuxtLink>
      </div>
    </header>
  </div>
</template>

<style lang="scss" scoped>
.nav-header {
  overflow: hidden;
  position: fixed; /* Set the navbar to fixed position */
  top: 0; /* Position the navbar at the top of the page */
  width: 100%; /* Full width */
}
</style>
