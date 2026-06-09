<template>
  <div class="flex justify-between items-center w-full">
    <volt-button v-if="currentStep > 1"> 
      <nuxt-link-locale  id="link-cart-previous" to="/cart/" class="block" @click="$emit('navigate:previous-page')">
        {{ $t("Retour") }}
      </nuxt-link-locale >
    </volt-button>

    <volt-button v-else>
      <nuxt-link-locale  id="link-home" to="/">
        <Icon name="i-fa7-solid:arrow-left" class="me-2" />
        {{ $t('Boutique') }}
      </nuxt-link-locale >
    </volt-button>
    
    <volt-button v-if="isAuthenticated">
      <nuxt-link-locale :to="nextPage" id="link-cart-next" class="block" @click="$emit('navigate:next-page')">
        {{ $t("Continuer") }}
      </nuxt-link-locale >
    </volt-button>

    <a v-else href="#" @click.prevent="toggleShowLoginDrawer(true)">
      <volt-button>
        {{ $t("Continuer") }}
      </volt-button>
    </a>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ nextPage: string }>()
defineEmits<{ 'navigate:previous-page': [], 'navigate:next-page': [] }>()

const { isAuthenticated } = useUser()
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

/**
 * 
 */

const { toggleShowLoginDrawer } = useModalsState()
</script>
