<template>
  <TailCardFooter>
    <div class="flex justify-between items-center">
      <NuxtLink v-if="currentStep > 1" id="link-card-previous" to="/cart/" class="block" @click="$emit('navigate:previous-page')">
        {{ $t("Retour") }}
      </NuxtLink>

      <NuxtLink v-else id="link-cart-shop" to="/">
        <Icon name="fa-solid:arrow-left" class="me-2" />
        Boutique
      </NuxtLink>
      
      <NuxtLink :to="nextPage" id="link-cart-next" class="block" @click="$emit('navigate:next-page')">
        {{ $t("Continuer") }}
      </NuxtLink>
    </div>
  </TailCardFooter>
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
