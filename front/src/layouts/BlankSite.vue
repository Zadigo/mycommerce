<template>
  <v-app>
    <v-main>
      <router-view :key="$route.name" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'BlankSite'
}
</script>
