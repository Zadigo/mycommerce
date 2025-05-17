<template>
  <nav class="block w-full px-4 py-2 mx-auto text-white bg-white shadow-md lg:px-8 lg:py-3 sticky top-0 z-50">
    <div class="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
      <NuxtLinkLocale  id="link-home-navbar" to="/" class="mr-4 block cursor-pointer py-1.5 text-base text-slate-800 font-semibold">
        Ecommerce
      </NuxtLinkLocale >

      <NavbarDropdownCollections />

      <div class="hidden lg:block">
        <ClientOnly>
          <ul class="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
              <TailButton id="action-search" class="ms-auto me-2 rounded-full" variant="default" @click="shopStore.showSearchModal=true">
                {{ $t('Rechercher') }}
              </TailButton>
            </li>

            <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
              <a id="action-cart-navbar" href="#" class="flex items-center gap-2" @click.prevent="handleShowCartDrawer">
                <Icon name="fa-solid:shopping-bag" size="18" />
                {{ $t("Panier") }}
              </a>
            </li>
            
            <li v-if="!authStore.isAuthenticated" class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
              <a id="action-signin" href="#" class="flex items-center gap-2" @click.prevent="authStore.showLoginDrawer=true">
                <Icon name="fa-solid:sign-in-alt" size="18" />
                {{ $t('Se connecter') }}
              </a>
            </li>
            <li v-else class="flex items-center p-1 text-sm gap-2 text-slate-600">
              <a id="action-signout" href="#" class="flex items-center" @click.prevent="proxyLogout">
                <Icon name="fa-solid:sign-out-alt" size="18" />
                {{ $t('Se déconnecter') }}
              </a>
            </li>
            
            <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
              <NuxtLinkLocale id="link-account-navbar" to="/account/" class="flex items-center gap-2">
                <Icon name="fa-solid:user" size="18" />
                {{ $t('Compte') }}
              </NuxtLinkLocale >
            </li>
          </ul>
        </ClientOnly>
      </div>

      <button id="action-menu" class="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden" type="button">
        <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

// const { gtag } = useGtag()
const shopStore = useShop()
const authStore = useAuthentication()
const cartStore = useCart()

const { showCartDrawer } = storeToRefs(cartStore)

/**
 * 
 */
function proxyLogout() {
  authStore.logout()
  authStore.showLoginDrawer = false
  authStore.accessToken = null
  authStore.refreshToken = null
}

/**
 *
 */
function handleShowCartDrawer() {
  showCartDrawer.value = true

  // TODO: G-Analytics
  // if (cartStore.cache && cartStore.hasProducts) {
  //   gtag('event', 'view_cart', {
  //     currency: 'EUR',
  //     value: cartStore.cartTotal,
  //     items: cartStore.cache.statistics.map((item, i) => {
  //       const result = cartStore.cache?.results.find(x => x.id === item.product__id)
  //       return {
  //         item_id: item.product__id,
  //         item_name: item.product__name,
  //         price: result?.product.get_price,
  //         quantity: item.quantity,
  //         item_brand: null,
  //         item_category: result?.product.category,
  //         item_category2: result?.product.sub_category,
  //         item_variant: result?.product.color,
  //         index: i,
  //         size: result?.size
  //       }
  //     })
  //   })
  // }
}
</script> 
