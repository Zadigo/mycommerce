<template>
  <nav class="block w-full px-4 py-2 mx-auto text-white bg-white shadow-md lg:px-8 lg:py-3 sticky top-0 z-50">
    <div class="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
      <nuxt-link-locale  id="link-home-navbar" to="/" class="mr-4 block cursor-pointer py-1.5 text-base text-slate-800 font-semibold">
        Ecommerce
      </nuxt-link-locale >

      <NavbarDropdownCollections />

      <div class="hidden lg:block">
        <client-only>
          <ul class="hidden gap-2 mt-2 mb-4 lg:mb-0 lg:flex lg:items-center lg:gap-6 lg:mt-0">
            <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
              <volt-secondary-button id="action-search" class="ms-auto me-2" rounded @click="() => { showSearchModal = true }">
                <icon name="i-lucide-search" />
                {{ $t('Rechercher') }}
              </volt-secondary-button>
            </li>

            <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
              <a id="action-cart-navbar" href="#" class="flex items-center gap-2" @click.prevent="handleShowCartDrawer">
                <icon name="i-fa7-solid:shopping-bag" size="18" />
                {{ $t("Panier") }}
              </a>
            </li>

            <li v-if="!isAuthenticated" class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
              <a id="action-signin" href="#" class="flex items-center gap-2" @click.prevent="() => { showLoginDrawer = true }">
                <icon name="i-fa7-solid:sign-in-alt" size="18" />
                {{ $t('Se connecter') }}
              </a>
            </li>
            <li v-else class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
              <a id="action-signout" href="#" class="flex items-center gap-2" @click.prevent="useLogout">
                <icon name="i-fa7-solid:sign-out-alt" size="18" />
                {{ $t('Se déconnecter') }}
              </a>
            </li>
            
            <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
              <nuxt-link-locale id="link-account-navbar" to="/account/" class="flex items-center gap-2">
                <icon name="i-fa7-solid:user" size="18" />
                {{ $t('Compte') }}
              </nuxt-link-locale >
            </li>
          </ul>
        </client-only>
      </div>

      <button id="action-menu" class="relative ml-auto h-6 max-h-10 w-6 select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden" type="button">
       <icon name="i-fa7-solid:bars" size="18" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
/**
 * Global modals
 */

const showCartDrawer = useState<boolean>('showCartDrawer')
const showLoginDrawer = useState<boolean>('showLoginDrawer')
const showSearchModal = useState<boolean>('showSearchModal')

// const { gtag } = useGtag()

/**
 * Authentication
 */

const { isAuthenticated } = useUser()

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
