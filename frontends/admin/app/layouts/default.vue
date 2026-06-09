<template>
  <section id="admin">
    <!-- Navbar -->
    <lazy-base-navbar hydrate-on-idle />

    <!-- Sidebar -->
    <lazy-base-sidebar hydrate-on-idle />

    <!-- Content -->
    <main class="ps-(--sidebar-width) mt-[calc(37px+2rem)]">
      <slot />
    </main>
  </section>
</template>

<script setup lang="ts">
const tokens = ['bg-slate-50', 'dark:bg-slate-700']
onMounted(() => { document.body.classList.add(...tokens) })
onUnmounted(() => { document.body.classList.remove(...tokens) })
</script>
