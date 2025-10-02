<template>
  <volt-drawer v-model:visible="showCartDrawer" position="right">
    <div class="flex justify-between items-center">
      <h2 class="font-bold">
        {{ $t('Cart quantity', { n: numberOfProducts }) }}
      </h2>

      <volt-button variant="outline" as-child>
        <NuxtLink id="link-wishlist" to="/wishlist" @click="showCartDrawer = false">
          <Icon name="i-fa7-regular:heart" class="me-2" />
          {{ $t('Favoris') }}
        </NuxtLink>
      </volt-button>
    </div>

    <div class="px-5">
      <div v-if="hasProducts" class="flex flex-col my-10">
        <div class="p-5 shadow-sm rounded-md bg-green-100">
          <div v-if="freeDeliveryTarget > 0">
            {{ $t('Livraison gratuite offerte', { n: $n(freeDeliveryTarget, 'currency') }) }}

            <!-- Il te manque 19,02 € pour profiter de la -->

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
        <CartIterator class="mt-2 mb-5" @edit-product="handleOpenProductEdition" />

        <div class="flex justify-between align-center py-4">
          <span class="font-light">{{ $t('Total (TVA comprise)') }}</span>
          <span class="font-bold">{{ $n(cartTotal, 'currency') }}</span>
        </div>

        <div class="place-self-baseline">
          isAuthenticated: {{ isAuthenticated }}

          <volt-button v-if="isAuthenticated">
            <NuxtLink od="link-start-checkout" to="/cart">
              {{ $t('Passer commande') }}
            </NuxtLink>
          </volt-button>

          <volt-button v-else id="action-login-cart" class="w-full rounded-full" size="lg" @click="showCartDrawer=false, showLoginDrawer=true">
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

          <volt-button size="lg" class="rounded-full" as-child @click.prevent="handleCartButtonRedirection">
            <NuxtLink id="link-collections-cart" to="/collections/all">
              {{ $t('Découvrir') }}
            </NuxtLink>
          </volt-button>
        </div>
      </div>
    </div>
  </volt-drawer>
</template>

<script lang="ts" setup>
import type { ProductToEdit } from '~/types'

const toLocalePath = useLocalePath()

const router = useRouter()

const showCartDrawer = useState<boolean>('showCartDrawer')
const showLoginDrawer = useState<boolean>('showLoginDrawer')

const { hasProducts, freeDeliveryTarget, numberOfProducts, cartTotal } = await useCartInformation()

const emit = defineEmits<{ 'edit-product': ProductToEdit }>()

/**
 * Authentication
 */

const { isAuthenticated } = useUser()

/**
 * Handles the redirection to the correct page
 * if the user clicks on the discover button
 * in the cart modal
 */
function handleCartButtonRedirection () {
  showCartDrawer.value = false
  router.push(toLocalePath('/shop/collection/novelties'))
}

/**
 * Handle the opening or the closing of 
 * the product edition dialog by ensuring
 * that cartDrawer is closed
 * TODO: Refactor this function
 */
function handleOpenProductEdition (editedProduct: ProductToEdit) {
  emit('edit-product', editedProduct)
}
</script>
