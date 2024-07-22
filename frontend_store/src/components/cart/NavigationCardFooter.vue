<template>
  <div class="card-footer">
    <div class="d-flex justify-content-between align-items-center">
      <!-- v-show="$route.name !== 'shop_payment_home'" -->
      <router-link v-if="$route.name !== 'shop_payment_home'" :to="{ name: 'shop_payment_home' }" class="btn btn-lg btn-light">Retour</router-link>
      <router-link v-else :to="{ name: 'shop_collections' }" class="btn btn-lg btn-light">
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="me-2" />
        Boutique
      </router-link>
      <router-link :to="{ name: nextPage }" class="btn btn-lg btn-light">Continuer</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nextPage: {
      type: String,
      required: true
    }
  }
}
</script>
