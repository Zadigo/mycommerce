<template>
  <v-main>
    <router-view :key="$route.name" name="dashboard" />
  </v-main>
</template>

<script>
export default {
  name: 'DashboardSite'
}
</script>
