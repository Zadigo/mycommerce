<template>
  <TailCardFooter>
    <div class="flex justify-between items-center w-full">
      <tail-button v-if="currentStep > 1" as-child> 
        <NuxtLinkLocale  id="link-cart-previous" to="/cart/" class="block" @click="$emit('navigate:previous-page')">
          {{ $t("Retour") }}
        </NuxtLinkLocale >
      </tail-button>

      <tail-button v-else as-child>
        <NuxtLinkLocale  id="link-home" to="/">
          <Icon name="i-fa7-solid:arrow-left" class="me-2" />
          {{ $t('Boutique') }}
        </NuxtLinkLocale >
      </tail-button>
      
      <tail-button as-child>
        <NuxtLinkLocale  :to="nextPage" id="link-cart-next" class="block" @click="$emit('navigate:next-page')">
          {{ $t("Continuer") }}
        </NuxtLinkLocale >
      </tail-button>
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
