<template>
  <v-navigation-drawer v-model="showCartDrawer" width="400" location="right" sticky temporary @close="showCartDrawer=false">
    <v-toolbar class="border-bottom" color="white">
      <v-toolbar-title class="fw-bold">
        {{ $t('Cart quantity', { n: numberOfProducts }) }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn to="/wishlist" rounded variant="outlined" @click="showCartDrawer = false">
        <font-awesome :icon="['far', 'heart']" class="me-2" />
        {{ $t('Favoris') }}
      </v-btn>
    </v-toolbar>

    <div class="px-10">
      <div v-if="hasProducts" class="flex flex-col">
        <div class="p-5 shadow-sm rounded-md bg-green-100">
          <div v-if="freeDeliveryTarget > 0">
            {{ cartTotal }}
            {{ $t('Livraison gratuite offerte', { n: $n(freeDeliveryTarget, 'currency') }) }}
            <!-- Il te manque 19,02 € pour profiter de la -->
            <span class="font-bold text-green-900 uppercase">
              {{ $t('livraison standard gratuite') }}
            </span>
          </div>

          <div v-else>
            <p class="font-bold text-blue-900 uppercase">
              {{ $t('Livraison standard gratuite') }}
            </p>

            <p class="font-light">
              {{ $t("Tu vas pouvoir profiter de la livraison standard gratuite à domicile") }}
            </p>
          </div>
        </div>
        
        <!-- Products -->
        <CartIterator class="my-2" @edit-product="handleOpenProductEdition" />

        <div class="flex justify-between align-center py-4">
          <span class="font-light">{{ $t('Total (TVA comprise)') }}</span>
          <span class="font-bold">{{ $n(cartTotal, 'currency') }}</span>
        </div>
        
        <div class="place-self-baseline">
          <v-btn v-if="isAuthenticated" to="/cart" color="secondary" rounded flat block>
            {{ $t('Passer commande') }}
          </v-btn>

          <v-btn v-else color="secondary" rounded flat block @click="showCartDrawer=false, showLoginDrawer=true">
            {{ $t('Passer commande') }}
          </v-btn>
        </div>
      </div>

      <div v-else class="px-5">
        <div class="flex flex-col items-center justify-center text-center my-3">
          <Icon name="fa-solid:shopping-bag" size="100" class="mb-5 text-dark" />
          
          <h3 class="text-2xl font-bold mb-3">
            {{ $t('Panier vide') }}
          </h3>
          
          <p class="font-light">
            {{ $t('Empty cart text') }}
          </p>
          
          <a href="#" @click.prevent="handleCartButtonRedirection">
            {{ $t('Découvrir') }}
          </a>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import type { ProductToEdit } from '~/types';

const router = useRouter()

const cartStore = useCart()
const { isAuthenticated, showLoginDrawer } = storeToRefs(useAuthentication())
const { showCartDrawer, numberOfProducts, hasProducts, freeDeliveryTarget, cartTotal } = storeToRefs(cartStore)

const emit = defineEmits({
  'edit-product' (_product: ProductToEdit) {
    return true
  }
})

// Handles the redirection to the correct page
// if the user clicks on the discover button
// in the cart modal
function handleCartButtonRedirection () {
  showCartDrawer.value = false
  router.push('/shop/collection/novelties')
}

/**
 * 
 * TODO: Refactor this function
 */
// Handle the opening or the closing of 
// the product edition dialog by ensuring
// that cartDrawer is closed
function handleOpenProductEdition (editedProduct: ProductToEdit) {
  emit('edit-product', editedProduct)
}
</script>
