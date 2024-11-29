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

    <div class="container mt-1">
      <div v-if="hasProducts" class="row d-flex justify-content-between">
        <div class="col-12 mt-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <p v-if="freeDeliveryTarget > 0" class="fw-light">
                {{ cartTotal }}
                {{ $t('Livraison gratuite offerte', { n: $n(freeDeliveryTarget, 'currency') }) }}
                <!-- Il te manque 19,02 € pour profiter de la -->
                <span class="fw-bold text-primary text-uppercase">
                  {{ $t('livraison standard gratuite') }}
                </span>
              </p>

              <div v-else class="fw-light">
                <p class="fw-bold text-success text-uppercase mb-1">
                  {{ $t('Livraison standard gratuite') }}
                </p>

                <p class="fw-light">
                  Tu vas pouvoir profiter de la livraison 
                  standard gratuite à domicile
                </p>
              </div>
            </div>
          </div>
        </div>

        <CartIterator class="my-2" @edit-product="handleOpenProductEdition" />

        <div class="d-flex justify-content-between align-items-center py-4">
          <span class="fw-light">{{ $t('Total (TVA comprise)') }}</span>
          <span class="fw-bold">{{ $n(cartTotal, 'currency') }}</span>
        </div>
        
        <div class="col-12">
          <v-btn v-if="isAuthenticated" to="/cart" color="secondary" rounded flat block>
            {{ $t('Passer commande') }}
          </v-btn>

          <v-btn v-else color="secondary" rounded flat block @click="showCartDrawer = false, showLoginDrawer = true">
            {{ $t('Passer commande') }}
          </v-btn>
        </div>
      </div>

      <div v-else class="col-12 mt-5 h-100">
        <div class="d-flex flex-column justify-content-center text-center my-3">
          <font-awesome icon="shopping-bag" size="7x" class="mb-5 text-dark" />
          
          <h3 class="h5 mb-3">
            {{ $t('Panier vide') }}
          </h3>
          
          <p class="fw-light">
            {{ $t('Empty cart text') }}
          </p>
          
          <a href="#" class="btn btn-block btn-primary btn-rounded btn-lg shadow-none" @click.prevent="handleCartButtonRedirection">
            {{ $t('Découvrir') }}
          </a>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { whenever } from '@vueuse/core';
import type { ProductToEdit } from '~/types';

const router = useRouter()

const { isAuthenticated, showLoginDrawer } = storeToRefs(useAuthentication())
const { showCartDrawer, numberOfProducts, hasProducts, freeDeliveryTarget, cartTotal, showEditProductDrawer } = storeToRefs(useCart())

const emit = defineEmits({
  'edit-product' (_product: ProductToEdit) {
    return true
  }
})

whenever(showCartDrawer, (value) => {
  if (value) {
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
})

/**
 * Handles the redirection to the correct page
 * if the user clicks on the discover button
 * in the cart modal
 */
function handleCartButtonRedirection () {
  showCartDrawer.value = false
  router.push('/shop/collection/novelties')
}

/**
 * Handle the opening or the closing of 
 * the product edition dialog by ensuring
 * that cartDrawer is closed
 * 
 * TODO: Refactor this function
 */
function handleOpenProductEdition (editedProduct: ProductToEdit) {
  emit('edit-product', editedProduct)
}
</script>
