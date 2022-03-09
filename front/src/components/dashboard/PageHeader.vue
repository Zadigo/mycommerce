<template>
  <b-card>
    <b-card-text class="d-flex flex-direction-row justify-content-left">
      <h1 class="home blue-text h2">
        <router-link :to="{ name: 'dashboard_index'}" class="text-decoration font-weight-bold">Accueil</router-link>
      </h1>

      <h1 class="h2">
        {{ title }}
      </h1>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true
    },
  }
}
</script>

<style scoped>
h1.home:after {
  content: " /";
  margin-right: .5rem;
}
</style>
