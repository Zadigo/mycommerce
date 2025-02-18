<template>
  <nav class="navbar navbar-expand-lg bg-white fixed-top shadow-none" style="z-index: 1000;">
    <div class="container-fluid align-items-center">
      <NuxtLink to="/" class="navbar-brand fw-bold text-uppercase">
        <span class="fs-5">
          E-commerce
        </span>
      </NuxtLink>
      
      <v-btn class="ms-auto" variant="tonal" color="dark" rounded @click="shopStore.showSearchModal=true">
        {{ $t('Rechercher') }}
      </v-btn>

      <ul class="navbar-nav">
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="handleShowCartDrawer">
            <font-awesome icon="shopping-bag" class="me-1" />
            {{ $t("Panier") }}
          </a>
        </li>

        <li v-if="!authStore.isAuthenticated" class="nav-item">
          <a href="#" class="nav-link" @click.prevent="authStore.showLoginDrawer=true">
            <font-awesome icon="right-to-bracket" class="me-1" />
            {{ $t('Se connecter') }}
          </a>
        </li>
        
        <li v-else class="nav-item">
          <a href="#" class="nav-link" @click.prevent="proxyLogout">
            <font-awesome icon="right-from-bracket" class="me-1" />
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
  </nav>
  <!-- <BaseNavHeader>
  </BaseNavHeader> -->
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
