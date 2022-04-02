<template>
  <v-app>
    <section id="dashboard">
      <top-header />

      <main style="margin-top: 58px">
        <div class="container pt-4">
          <router-view :key="$route.name" />        
        </div>
      </main>
    </section>
  </v-app>
</template>

<script>
import TopHeader from '@/components/dashboard/TopHeader.vue'

export default {
  name: 'DashboardSite',
  components: {
    TopHeader
  }
}
</script>
