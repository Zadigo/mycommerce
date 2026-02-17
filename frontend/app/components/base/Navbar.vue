<template>
  <nav class="block w-full px-4 py-2 mx-auto text-white bg-white shadow-md lg:px-8 lg:py-3 sticky top-0 z-50">
    <div class="container flex flex-wrap items-center justify-between mx-auto text-primary-800">
      <nuxt-link-locale  id="link-home-navbar" to="/" class="mr-4 block py-1.5 text-base text-primary-800 font-semibold uppercase">
        {{ get('legalName') }}
      </nuxt-link-locale>

      <ul class="hidden lg:flex lg:items-center lg:mb-0 lg:gap-6 lg:mt-0 gap-2 mt-2 mb-4">
        <li class="flex items-center p-1 text-sm gap-x-2 text-primary-600">
          <volt-secondary-button id="action-search" class="ms-auto me-2" rounded @click="() => { toggleShowSearchModal() }">
            <icon name="i-lucide-search" />
            {{ $t('Rechercher') }}
          </volt-secondary-button>
        </li>

        <!-- OLD - Method -->
        <!-- <li class="flex items-center p-1 text-sm gap-x-2 text-primary-600">
          <nuxt-link-locale v-if="isAuthenticated" id="link-cart-navbar" to="/cart">
            <icon name="i-fa7-solid:shopping-bag" size="18" />
            {{ $t("Panier") }}
          </nuxt-link-locale>
          <a v-else id="action-cart-navbar" href="#" class="flex items-center gap-2" @click.prevent="() => { toggleShowCartDrawer() }">
            <icon name="i-fa7-solid:shopping-bag" size="18" />
            {{ $t("Panier") }}
          </a>
        </li> -->

        <li class="flex items-center p-1 text-sm gap-x-2 text-primary-600">
          <nuxt-link-locale id="link-cart-navbar" to="/cart">
            <icon name="i-fa7-solid:shopping-bag" size="18" />
            {{ $t("Panier") }}
          </nuxt-link-locale>
        </li>

        <li v-if="!isAuthenticated" class="flex items-center p-1 text-sm gap-x-2 text-primary-600">
          <a id="action-signin" href="#" class="flex items-center gap-2" @click.prevent="() => { toggleLoginDrawer() }">
            <icon name="i-fa7-solid:sign-in-alt" size="18" />
            {{ $t('Se connecter') }}
          </a>
        </li>
        <li v-else class="flex items-center p-1 text-sm gap-x-2 text-primary-600">
          <a id="action-signout" href="#" class="flex items-center gap-2" @click.prevent="async () => { await useLogout() }">
            <icon name="i-fa7-solid:sign-out-alt" size="18" />
            {{ $t('Se déconnecter') }}
          </a>
        </li>
        
        <li class="flex items-center p-1 text-sm gap-x-2 text-primary-600">
          <nuxt-link-locale id="link-account-navbar" to="/account/" class="flex items-center gap-2">
            <icon name="i-fa7-solid:user" size="18" />
            {{ $t('Compte') }}
          </nuxt-link-locale >
        </li>
      </ul>
      
      <button id="action-menu" class="relative ml-auto h-6 max-h-10 w-6 select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden" type="button">
       <icon name="i-fa7-solid:bars" size="18" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useBusinessDetails } from '~~/layers/base/app/data'

/**
 * Other modals
 */

const showLoginDrawer = useState<boolean>('showLoginDrawer')
const toggleLoginDrawer = useToggle(showLoginDrawer)

const showSearchModal = useState<boolean>('showSearchModal')
const toggleShowSearchModal = useToggle(showSearchModal)

/**
 * Business
 */

const { get } = await useBusinessDetails()

/**
 * Authentication
 */

const { isAuthenticated } = useUser()

/**
 * Cart
 */

const showCartDrawer = useState<boolean>('showCartDrawer')
const toggleShowCartDrawer = useToggle(showCartDrawer)
</script> 
