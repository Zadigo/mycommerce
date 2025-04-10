<template>
  <BaseNavbar>
    <div class="flex justify-between align-center px-5">
      <NuxtLink to="/" class="text-md uppercase font-bold">
        E-commerce
      </NuxtLink>
      
      <v-btn class="ms-auto me-2" variant="tonal" color="dark" rounded @click="shopStore.showSearchModal=true">
        {{ $t('Rechercher') }}
      </v-btn>

      <ul class="inline-flex gap-3">
        <li class="nav-item">
          <a href="#" class="inline-flex items-center gap-1" @click.prevent="handleShowCartDrawer">
            <Icon name="fa-solid:shopping-bag" size="18" class="me-1" />
            {{ $t("Panier") }}
          </a>
        </li>

        <li v-if="!authStore.isAuthenticated" class="nav-item">
          <a href="#" class="inline-flex items-center gap-1" @click.prevent="authStore.showLoginDrawer=true">
            <Icon name="fa-solid:sign-in-alt" size="18" class="me-1" />
            {{ $t('Se connecter') }}
          </a>
        </li>
        
        <li v-else class="nav-item">
          <a href="#" class="inline-flex items-center gap-1" @click.prevent="proxyLogout">
            <Icon name="fa-solid:sign-out-alt" size="18" class="me-1" />
            {{ $t('Se déconnecter') }}
          </a>
        </li>
        
        <li v-show="authStore.isAuthenticated" class="nav-item">
          <NuxtLink to="/account/" class="nav-link">
            <font-awesome icon="user" class="me-1" />
            {{ $t('Compte') }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </BaseNavbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const shopStore = useShop()
const authStore = useAuthentication()
const cartStore = useCart()
const { showCartDrawer } = storeToRefs(useCart())
// const { gtag } = useGtag()

function proxyLogout () {
  authStore.logout()
  authStore.showLoginDrawer = false
  authStore.accessToken = null
  authStore.refreshToken = null
}

function handleShowCartDrawer () {
  showCartDrawer.value = true

  if (cartStore.cache && cartStore.hasProducts) {
    // gtag('event', 'view_cart', {
    //   currency: 'EUR',
    //   value: cartStore.cartTotal,
    //   items: cartStore.cache.statistics.map((item, i) => {
    //     const result = cartStore.cache?.results.find(x => x.id === item.product__id)
    //     return {
    //       item_id: item.product__id,
    //       item_name: item.product__name,
    //       price: result?.product.get_price,
    //       quantity: item.quantity,
    //       item_brand: null,
    //       item_category: result?.product.category,
    //       item_category2: result?.product.sub_category,
    //       item_variant: result?.product.color,
    //       index: i,
    //       size: result?.size
    //     }
    //   })
    // })
  }
}
</script> 
