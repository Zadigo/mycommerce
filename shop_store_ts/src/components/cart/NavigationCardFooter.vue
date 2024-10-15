<template>
  <div class="card-footer">
    <div class="d-flex justify-content-between align-items-center">
      <router-link v-if="$route.name !== 'shop_payment_home'" :to="{ name: 'shop_payment_home' }" class="btn btn-lg btn-light" @click="$emit('navigate:previous-page')">
        {{ $t("Retour") }}
      </router-link>

      <router-link v-else :to="{ name: 'shop_collections' }" class="btn btn-lg btn-light">
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="me-2" />
        Boutique
      </router-link>
      
      <router-link :to="{ name: nextPage }" class="btn btn-lg btn-light" @click="$emit('navigate:next-page')">
        {{ $t("Continuer") }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavigationCardFooter',
  props: {
    nextPage: {
      type: String,
      required: true
    }
  },
  emits: {
    'navigate:previous-page' () {
      return true
    },
    'navigate:next-page' () {
      return true
    }
  },
})
</script>
