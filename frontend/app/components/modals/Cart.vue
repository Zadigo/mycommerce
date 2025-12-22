<template>
  <volt-drawer v-model:visible="showCartDrawer" position="right" :style="{ width: '500px' }">
    <div class="flex justify-between items-center">
      <h2 v-if="cartSession" class="font-bold">
        {{ $t('Cart quantity', { n: cartSession.numberOfItems }) }}
      </h2>

      <volt-button variant="outlined">
        <nuxt-link-locale id="link-wishlist" to="/wishlist" @click="showCartDrawer = false">
          <icon name="i-fa7-regular:heart" class="me-2" />
          {{ $t('Favoris') }}
        </nuxt-link-locale>
      </volt-button>
    </div>

    <volt-divider />
    
    <div class="px-5">      
      <div v-if="cartSession" class="flex flex-col my-10">
        <div class="p-5 shadow-sm rounded-md bg-green-100">
          <div v-if="remainingForFreeDelivery > 0">
            {{ $t('Livraison gratuite offerte', { n: $n(remainingForFreeDelivery, 'currency') }) }}

            <span class="font-bold text-green-900 uppercase">
              {{ $t('livraison standard gratuite') }}
            </span>
          </div>

          <div v-else>
            <p class="font-bold text-green-900 uppercase">
              {{ $t('Livraison standard gratuite') }}
            </p>

            <p class="font-light">
              {{ $t("Tu vas pouvoir profiter de la livraison standard gratuite à domicile") }}
            </p>
          </div>
        </div>

        <!-- Products -->
        <cart-iterator class="mt-2 mb-5" @edit-product="handleOpenProductEdition" />

        <div class="flex justify-between align-center py-4">
          <span class="font-light">{{ $t('Total (TVA comprise)') }}</span>
          <span class="font-bold">{{ $n(cartSession.total, 'currency') }}</span>
        </div>

        <div class="place-self-baseline">
          <volt-button v-if="isAuthenticated">
            <nuxt-link-locale id="link-start-checkout" to="/cart">
              {{ $t('Passer commande') }}
            </nuxt-link-locale>
          </volt-button>

          <volt-button v-else id="action-login-cart" rounded @click="showCartDrawer=false, showLoginDrawer=true">
            {{ $t('Passer commande') }}
          </volt-button>
        </div>
      </div>

      <div v-else class="px-1">
        <div class="flex flex-col items-center justify-center text-center h-screen">
          <Icon name="i-fa7-solid:shopping-bag" size="100" class="mb-5 text-dark" />

          <h3 class="text-2xl font-bold mb-3">
            {{ $t('Panier vide') }}
          </h3>

          <p class="font-light mb-10">
            {{ $t('Empty cart text') }}
          </p>

          <volt-button @click.prevent="handleCartButtonRedirection">
            <nuxt-link-locale id="link-collections-cart" to="/collections/all">
              {{ $t('Découvrir') }}
            </nuxt-link-locale>
          </volt-button>
        </div>
      </div>
    </div>
  </volt-drawer>
</template>

<script lang="ts" setup>
import type { CartItem } from '~/types'

const emit = defineEmits<{ 'edit-product': CartItem }>()

const toLocalePath = useLocalePath()

const showCartDrawer = useState<boolean>('showCartDrawer')
const showLoginDrawer = useState<boolean>('showLoginDrawer')

const { cartSession, freeDeliveryTarget } = useCartComposable()

/**
 * Free delivery target
 */

const deliveryTarget = ref(100)
const remainingForFreeDelivery = freeDeliveryTarget(cartSession?.data.value?.total, deliveryTarget)

/**
 * Authentication
 */

const { isAuthenticated } = useUser()

const router = useRouter()

// Handles the redirection to the correct page
// if the user clicks on the discover button
// in the cart modal
function handleCartButtonRedirection () {
  showCartDrawer.value = false
  router.push(toLocalePath('/shop/collection/novelties'))
}

const cartStore = useCart()
const { currentEditedProduct, showEditProductDrawer } = storeToRefs(cartStore)

// Handle the opening or the closing of
// the product edition dialog by ensuring
// that cartDrawer is closed
function handleOpenProductEdition (editedProduct: CartItem) {
  currentEditedProduct.value = editedProduct
  showCartDrawer.value = false
  showEditProductDrawer.value = true
}
</script>
