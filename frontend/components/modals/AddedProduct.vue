<template>
  <v-navigation-drawer v-model="showAddedProductDrawer" width="400" location="right" temporary @close="showAddedProductDrawer=false">
    <div class="px-5">
      <div v-if="hasProducts" class="my-5">
        <div class="d-flex justify-content-start mb-5 fs-5 align-items-center gap-2">
          <font-awesome icon="circle-check" class="text-success" />
          <span>{{ $t('Ajouté au panier') }}</span>
        </div>

        <div v-if="lastAddedProduct" class="my-2">
          <NuxtImg v-if="lastAddedProduct" :src="mediaPath(lastAddedProduct.product.get_main_image?.original, '/placeholder.svg')" :alt="lastAddedProduct.product.name" format="webp" class="rounded-md" />            

          <p class="font-bold mt-5">
            {{ $n(parseFloat(lastAddedProduct.product.get_price.toString()), 'currency') }}
          </p>
          
          <p class="font-normal">
            {{ lastAddedProduct?.product.name }}
          </p>
          
          <p class="text-slate-500">
            Taille: {{ lastAddedProduct?.size }}
          </p>
        </div>

        <div class="my-5">
          <v-btn color="primary" block @click="handleNotAuthenticatedOrdering">
            {{ $t('Passer commande') }}
          </v-btn>

          <v-btn class="mt-2" variant="text" block @click="showAddedProductDrawer = false, showCartDrawer = true">
            {{ $t('Voir le panier') }}
          </v-btn>
        </div>
        
        <!-- Recommendations -->
        <BaseRecommendations :quantity="20" :columns="3" :load-cache="true" :show-carousel="false" :show-like-button="false" :show-cart="false" :show-prices="false" />
      </div>
      <ModalsSkeletonLoader v-else />
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const toLocalePath = useLocalePath()
const cartStore = useCart()
const authenticationStore = useAuthentication()
const router = useRouter()

const { mediaPath } = useDjangoUtilies()

const { lastAddedProduct, showAddedProductDrawer, showCartDrawer, hasProducts } = storeToRefs(cartStore)

/**
 * Handles the situation where the user tries
 * to go to the cart but is not logged in. If
 * he tries to access the cart while anonymous,
 * he is invited to login before pursuing
 */
function handleNotAuthenticatedOrdering () {
  if (authenticationStore.isAuthenticated) {
    showAddedProductDrawer.value = false
    router.push(toLocalePath('/cart/'))
  } else {
    showCartDrawer.value = false
    showAddedProductDrawer.value = false
    authenticationStore.showLoginDrawer = true
  }
}
</script>
