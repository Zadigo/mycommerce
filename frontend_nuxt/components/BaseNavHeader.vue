<template>
  <div class="shadow-sm">
    <slot />

    <header class="py-3 mb-4 border-bottom">
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
