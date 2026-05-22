<template>
  <section id="admin">
    <!-- Navbar -->
    <base-navbar />

    <!-- Sidebar -->
    <base-sidebar />

    <!-- Content -->
    <div class="has-[#sidebar]:ps-[var(--sidebar-width)] mt-[calc(37px+2rem)]">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
onMounted(() => { document.body.classList.add('bg-slate-50') })
onUnmounted(() => { document.body.classList.remove('bg-slate-50') })
</script>
