<template>
  <v-navigation-drawer v-model="showAddedProductDrawer" width="400" location="right" temporary @close="showAddedProductDrawer=false">
    <div class="container">
      <div class="row my-3">
        <div v-if="hasProducts" class="col-12">
          <div class="d-flex justify-content-start mb-5 fs-5 align-items-center gap-2">
            <font-awesome icon="circle-check" class="text-success" />
            <span>{{ $t('Ajouté au panier') }}</span>
          </div>

          <div class="row">
            <div class="col-4">
              <!-- <NuxtImg v-if="lastAddedProduct" :src="mediaPath(lastAddedProduct.product.get_main_image.original)" :alt="lastAddedProduct?.product.name" class="img-fluid" /> -->
            </div>

            <div class="col-8">
              <p class="fw-bold mb-1">
                {{ $n(parseFloat(lastAddedProduct.product.get_price), 'currency') }}
              </p>
              
              <p class="mb-2">
                {{ lastAddedProduct?.product.name }}
              </p>
              
              <p class="text-body-secondary">
                Taille: {{ lastAddedProduct?.size }}
              </p>
            </div>
          </div>

          <div class="row my-3">
            <div class="col-12">
              <v-btn color="primary" block @click="handleNotAuthenticatedOrdering">
                {{ $t('Passer commande') }}
              </v-btn>

              <v-btn class="mt-2" variant="text" block @click="showAddedProductDrawer = false, showCartDrawer = true">
                {{ $t('Voir le panier') }}
              </v-btn>
            </div>
          </div>

          <!-- TODO: Iterate products -->
          <h4 class="text-center h5">
            {{ $t('Autres produits') }}
          </h4>

          <div class="row gx-1 gy-1 products-wrapper">
            <div v-for="i in 10" :key="i" class="col-4">
              <NuxtLink :to="`shop/${i}`" class="link-dark">
                <v-img src="/img7.jpeg" alt="" class="img-fluid" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
const { mediaPath } = useDjangoUtilies()
const { lastAddedProduct, showAddedProductDrawer, showCartDrawer, hasProducts } = storeToRefs(useCart())

const authenticationStore = useAuthentication()

const router = useRouter()

/**
 * Handles the situation where the user tries
 * to go to the cart but is not logged in. If
 * he tries to access the cart while anonymous,
 * he is invited to login before pursuing
 */
function handleNotAuthenticatedOrdering () {
  if (authenticationStore.isAuthenticated) {
    showAddedProductDrawer.value = false
    router.push('/cart/')
  } else {
    showCartDrawer.value = false
    showAddedProductDrawer.value = false
    authenticationStore.showLoginDrawer = true
  }
}
</script>
