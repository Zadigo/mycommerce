<template>
  <volt-drawer v-model:visible="showAddedProductDrawer" position="right">
    <div class="px-5 overflow-y-scroll">
      <div v-if="cart" class="my-5">
        <div class="flex justify-start mb-5 fs-5 items-center gap-2">
          <Icon name="circle-check" class="text-green-500" />
          <span>{{ $t('Ajouté au panier') }}</span>
        </div>

        <div v-if="lastProduct" class="my-2">
          <NuxtImg :src="lastProduct.product.mainImage.original" :alt="lastProduct.product.mainImage.name" format="webp" class="rounded-md" />

          <p class="font-bold mt-5">
            {{ $n(parseFloat(lastProduct.product.price.toString()), 'currency') }}
          </p>

          <p class="font-normal">
            {{ lastProduct.product.name }}
          </p>

          <p class="text-slate-500">
            Taille: {{ lastProduct.size }}
          </p>

          <div class="my-5">
            <volt-button class="w-full" @click="handleNotAuthenticatedOrdering">
              {{ $t('Passer commande') }}
            </volt-button>

            <volt-button class="mt-2 w-full" @click="showAddedProductDrawer = false, showCartDrawer = true">
              {{ $t('Voir le panier') }}
            </volt-button>
          </div>
        </div>

        <volt-skeleton v-else height="300px" class="w-full mb-10" />

        <!-- Recommendations -->
        <base-recommendations :quantity="20" :columns="3" :load-cache="true" :show-carousel="false" :show-like-button="false" :show-cart="false" :show-prices="false" />
      </div>

      <ModalsSkeletonLoader v-else />
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
const toLocalePath = useLocalePath()
const router = useRouter()

const cartStore = useCart()
const { showAddedProductDrawer, showCartDrawer } = storeToRefs(cartStore)

const { cart, lastProduct } = useCartComposable()

const showLoginDrawer = useState<boolean>('showLoginDrawer')
const { isAuthenticated } = useUser()

/**
 * Handles the situation where the user tries
 * to go to the cart but is not logged in. If
 * he tries to access the cart while anonymous,
 * he is invited to login before pursuing
 */
function handleNotAuthenticatedOrdering () {
  if (isAuthenticated.value) {
    showAddedProductDrawer.value = false
    router.push(toLocalePath('/cart/'))
  } else {
    showCartDrawer.value = false
    showAddedProductDrawer.value = false
    showLoginDrawer.value = true
  }
}
</script>
