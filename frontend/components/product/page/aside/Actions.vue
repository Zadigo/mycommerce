<template>
  <div id="actions">
    <div v-if="product" id="sizes" class="inline-flex gap-2 mb-4">
      <!-- Sizes -->
      <button v-for="size in product.sizes" :key="size.id" type="button" :class="{'bg-gray-200': userSelection.size === size.name, 'bg-gray-50': userSelection.size !== size.name }" class="rounded-full w-10 h-10 text-sm font-normal place-content-center hover:bg-gray-100 hover:border-2 hover:border-gray-100" @click="proxySelectSize(size.name)">
        <Icon v-if="!size.availability" name="fa-regular:clock" size="12" class="text-orange-400" />
        {{ size.name }}
      </button>
    </div>
    <BaseSkeleton v-else :loading="true" />

    <p class="font-light">
      {{ $t('Taille et hauteur du mannequin') }} : 
      <span v-if="product.model_height">{{ product.model_size }} · {{ product.model_height }} cm</span> 
      <span v-else>N.D.</span>
    </p>
    
    <NuxtLink id="link-product-size-guide" to="#" class="text-sm font-semibold underline underline-offset-2 block mt-2" @click="emit('show-size-guide')">
      {{ $t('Guide des tailles') }}
    </NuxtLink>

    <p v-if="showSizeSelectionWarning" class="text-red-400 mt-4">
      {{ $t("Choissis une taille") }}
    </p>

    <TailButton v-if="userSelection.size !== '' && sizeObject && !sizeObject.availability" id="action-inform" class="mt-5 place-content-center" variant="secondary" tonal @click="showAvailabilityModal=true">
      <Icon name="fa:envelope" size="12" class="me-1" />
      {{ $t('Me tenir informer') }}
    </TailButton>
    <TailButton v-else id="action-add-cart" class="mt-5 me-2 place-content-cetner" :disabled="false" @click="proxyAddToCart">
      <font-awesome v-if="stockState && stockState.almost_sold_out" icon="clock" class="me-1" />
      {{ $t('Ajouter au panier') }}
    </TailButton>

    <TailButton id="action-add-favorite" :aria-label="$t('Ajouter au favori')" class="mt-5" variant="outline" @click="proxyHandleLike">
      <font-awesome v-if="isLiked" icon="heart" />
      <font-awesome v-else :icon="['far', 'heart']" />
    </TailButton>
  </div>
</template>

<script setup lang="ts">
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { useStorage } from '@vueuse/core'

import type { PropType } from 'vue'
import type { Product, ProductStock } from '~/types'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  }
})

const emit = defineEmits({
  'show-size-guide'() {
    return true
  }
})

const stockState = inject<ProductStock>('stockState')

const { $fireStore } = useNuxtApp()
const cartStore = useCart()
const { userSelection, showSizeSelectionWarning, showAddedProductDrawer } = storeToRefs(cartStore)
const { isLiked, handleLike } = useShopComposable()
const likedProducts = useStorage<number[]>('likedProducts', [])

// const sizeEl = ref<HTMLElement>()
const showAvailabilityModal = ref(false)

const sizeObject = computed(() => {
  if (props.product) {
    return props.product.sizes.find(x => x.name === userSelection.value.size) || null
  } else {
    return null
  }
})

/**
 * 
 */
function proxyHandleLike() {
  const result = handleLike(likedProducts.value, props.product)
  likedProducts.value = result
  isLiked.value = !isLiked.value

  // TODO: G-Analytics
  // gtag('event', 'add_to_wishlist', {
  //   items: {
  //     item_id: props.product?.id,
  //     item_name: props.product?.name,
  //     price: props.product?.get_price,
  //     quantity: 1,
  //     item_brand: null,
  //     item_category: props.product?.category,
  //     item_category2: props.product?.sub_category,
  //     item_variant: props.product?.color,
  //     index: 0,
  //     item_reference: null
  //   }
  // })
}

// Handles the action of adding a product
// to the current user's cart. Products that
// require a size will force the user to
// select a size before handling the action
async function proxyAddToCart() {
  if (props.product) {
    cartStore.addToCart(props.product, null, async (data) => {
      if (cartStore.sessionCache) {
        cartStore.sessionCache.cart = data
        
        showAddedProductDrawer.value = true
        
        console.log('Cart API response', data)
        
        // if (cartStore.sessionId) {
        //   const userRef = doc($fireStore, 'users', cartStore.sessionId)
        //   const userSnapshot = await getDoc(userRef)

        //   console.info('has user snapshot', userSnapshot.exists())
          
        //   if (userSnapshot.exists()) {
        //     await updateDoc(userRef, { cart: data })
        //   }
        // }
      }      

      // TODO: G-Analytics
      // gtag('event', 'add_to_cart',  {
      //   currency: 'EUR',
      //   value: props.product?.get_price,
      //   items: [
      //     {
      //       item_id: props.product?.id,
      //       item_name: props.product?.name,
      //       price: props.product?.get_price,
      //       quantity: 1,
      //       item_brand: null,
      //       item_category: props.product?.category,
      //       item_category2: props.product?.sub_category,
      //       item_variant: props.product?.color,
      //       index: 0,
      //       item_reference: null,
      //       size: userSelection.value.size
      //     }
      //   ]
      // })

      // if (sizeEl.value) {
      //   sizeEl.value.resetSize()
      // }
    })
  }
}

/**
 * Actions where the user selects a given size 
 * for a given product 
 */
function proxySelectSize(size: string | number | null | undefined) {
  if (size) {
    showSizeSelectionWarning.value = false
    cartStore.handleSizeSelection(props.product, size)
  }
}

onMounted(() => {
  if (props.product) {
    isLiked.value = likedProducts.value.includes(props.product.id)
  }
})
</script>
