<template>
  <section id="admin">
    <!-- Navbar -->
    <lazy-base-navbar hydrate-on-idle />

    <!-- Sidebar -->
    <lazy-base-sidebar hydrate-on-idle />

    <!-- Content -->
    <main class="has-[#sidebar]:ps-[--sidebar-width] mt-[calc(37px+2rem)]">
      <slot />
    </main>
  </section>
</template>

<script setup lang="ts">
onMounted(() => { document.body.classList.add('bg-slate-50') })
onUnmounted(() => { document.body.classList.remove('bg-slate-50') })
</script>
