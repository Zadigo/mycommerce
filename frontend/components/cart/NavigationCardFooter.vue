<template>
  <div class="card-footer">
    <div class="d-flex justify-content-between align-items-center">
      <NuxtLink v-if="currentStep > 1" to="/cart/" class="btn btn-lg btn-light" @click="$emit('navigate:previous-page')">
        {{ $t("Retour") }}
      </NuxtLink>

      <NuxtLink v-else to="/" class="btn btn-lg btn-light">
        <font-awesome icon="arrow-left" class="me-2" />
        Boutique
      </NuxtLink>
      
      <NuxtLink :to="nextPage" class="btn btn-lg btn-light" @click="$emit('navigate:next-page')">
        {{ $t("Continuer") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  nextPage: {
    type: String,
    required: true
  }
})

defineEmits({
  'navigate:previous-page' () {
    return true
  },
  'navigate:next-page' () {
    return true
  }
})

const route = useRoute()

const currentStep = computed(() => {
  if (route.path === '/cart') {
    return 1
  } else if (route.path === '/cart/shipment') {
    return 2
  } else if (route.path === '/cart/payment') {
    return 3
  } else if (route.path === '/cart/success') {
    return 4
  } else {
    return 0
  }
})
</script>
