<template>
  <div id="actions">    
    <!-- Sizes -->
    <product-size-block v-if="product" :product="product" class="mb-4" />
    <volt-skeleton v-else height="100px" class="w-2/6" />

    <!-- Model information -->
    <div v-if="product" class="font-light">
      <div class="border rounded-md py-3 px-4 text-sm font-light bg-gray-50 my-5">
        {{ $t('Taille et hauteur du mannequin') }} : 
        <span v-if="product.node.modelHeight">{{ product.node.modelSize }} · {{ $n(parseInt(product.node.modelHeight.toString()), 'unit') }}</span> 
        <span v-else>N.D.</span>
      </div>
    </div>

    <nuxt-link-locale id="link-product-size-guide" to="#" class="text-sm font-semibold underline underline-offset-2 block mt-2" @click="emit('size-guide')">
      {{ $t('Guide des tailles') }}
    </nuxt-link-locale>

    <p v-if="showSizeSelectionWarning" class="text-red-400 mt-4">
      {{ $t("Choissis une taille") }}
    </p>

    <!-- <DevOnly>
      {{ userSelection }} - {{ sizeObject }}
    </DevOnly> -->

    <volt-button v-if="userSelection.size !== '' && sizeObject && !sizeObject.availability" id="action-inform" class="mt-5 place-content-center" @click="() => emit('availability-modal')">
      <Icon name="fa:envelope" size="12" class="me-1" />
      {{ $t('Me tenir informer') }}
    </volt-button>
    <volt-button v-else id="action-add-cart" class="mt-5 me-2 place-content-center" :disabled="false" @click="proxyAddToCart">
      <Icon v-if="stockState && stockState.almost_sold_out" name="i-fa7-solid:clock" class="me-1" />
      {{ $t('Ajouter au panier') }}
    </volt-button>

    <volt-button id="action-add-favorite" :aria-label="$t('Ajouter au favori')" class="mt-5" variant="outline" @click="proxyHandleLike">
      <Icon :name="icon" />
    </volt-button>
  </div>
</template>

<script setup lang="ts">
import type { BaseSizeSet, ClotheSizes, Product, ProductNode, Undefineable } from '~/types'

const props = defineProps<{ product: ProductNode }>()
const emit = defineEmits<{ 'size-guide': [], 'availability-modal': [] }>()

const stockState = inject<ProductStockApiResponse>('stockState')

const cartStore = useCart()
const { userSelection, showSizeSelectionWarning } = storeToRefs(cartStore)

/**
 * Like
 */

const { like, icon } = await useLikeComposable(props.product)

const sizeObject = computed(() => {
  if (isDefined(props.product)) {
    return props.product.node.sizeSet.find(x => x.name === userSelection.value.size) || null
  } else {
    return null
  }
})

/**
 * Proxy function that handles the action
 * of liking the current product
 */
function proxyHandleLike() {
  if (isDefined(like)) {
    like()
  
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
}

const { sync } = await useSyncCart()

async function proxyAddToCart() {
  cartStore.addToCart(props.product, async (data) => {
    console.log('proxyAddToCart', data)
    sync(data)

    // if (cartStore.sessionId) {
    //   const userRef = doc($fireStore, 'users', cartStore.sessionId)
    //   const userSnapshot = await getDoc(userRef)

    //   console.info('has user snapshot', userSnapshot.exists())
      
    //   if (userSnapshot.exists()) {
    //     await updateDoc(userRef, { cart: data })
    //   }
    // }

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

/**
 * Proxy function that handles the action
 * of selecting a size for the current product
 * @param size The item's size
 */
function proxySelectSize(size: BaseSizeSet) {
  showSizeSelectionWarning.value = false
  cartStore.sizeSelection(props.product, size)
}
</script>
