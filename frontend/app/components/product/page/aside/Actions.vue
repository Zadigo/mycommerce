<template>
  <div id="actions">
    <div v-if="product" id="sizes" class="inline-flex gap-2 mb-4">
      <!-- Sizes -->
      <button v-for="size in product.sizes" :key="size.id" type="button" :class="{'bg-gray-200': userSelection.size === size.name, 'bg-gray-50': userSelection.size !== size.name }" class="rounded-full w-10 h-10 text-sm font-normal place-content-center cursor-pointer hover:bg-gray-100 hover:border-2 hover:border-gray-100" @click="proxySelectSize(size.name)">
        <Icon v-if="!size.availability" name="i-fa7-regular:clock" size="12" class="text-orange-400" />
        {{ size.name }}
      </button>
    </div>
    <TailSkeleton v-else class="h-[100px] w-2/6" />

    <p v-if="product" class="font-light">
      {{ $t('Taille et hauteur du mannequin') }} : 
      <span v-if="product.model_height">{{ product.model_size }} · {{ $n(parseInt(product.model_height), 'unit') }}</span> 
      <span v-else>N.D.</span>
    </p>
    
    <NuxtLinkLocale id="link-product-size-guide" to="#" class="text-sm font-semibold underline underline-offset-2 block mt-2" @click="emit('size-guide')">
      {{ $t('Guide des tailles') }}
    </NuxtLinkLocale >

    <p v-if="showSizeSelectionWarning" class="text-red-400 mt-4">
      {{ $t("Choissis une taille") }}
    </p>

    <!-- <DevOnly>
      {{ userSelection }} - {{ sizeObject }}
    </DevOnly> -->

    <TailButton v-if="userSelection.size !== '' && sizeObject && !sizeObject.availability" id="action-inform" class="mt-5 place-content-center" @click="() => emit('availability-modal')">
      <Icon name="fa:envelope" size="12" class="me-1" />
      {{ $t('Me tenir informer') }}
    </TailButton>
    <TailButton v-else id="action-add-cart" class="mt-5 me-2 place-content-center" :disabled="false" @click="proxyAddToCart">
      <Icon v-if="stockState && stockState.almost_sold_out" name="i-fa7-solid:clock" class="me-1" />
      {{ $t('Ajouter au panier') }}
    </TailButton>

    <TailButton id="action-add-favorite" :aria-label="$t('Ajouter au favori')" class="mt-5" variant="outline" @click="proxyHandleLike">
      <Icon v-if="isLiked" name="i-fa7-solid:heart" />
      <Icon v-else name="i-fa7-regular:heart" />
    </TailButton>
  </div>
</template>

<script setup lang="ts">
import type { DefaultClotheSize } from '~/data'
import type { Product, ProductStockApiResponse } from '~/types'

const props = defineProps<{ product: Product | null | undefined }>()
const emit = defineEmits<{ 'size-guide': [], 'availability-modal': [] }>()

const stockState = inject<ProductStockApiResponse>('stockState')

const cartStore = useCart()
const { userSelection, showSizeSelectionWarning } = storeToRefs(cartStore)
const { isLiked, like } = useLikeComposable(props.product)

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
  if (like) {
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

/**
 * Handles the action of adding a product
 * to the current user's cart. Products that
 * require a size will force the user to
 * select a size before handling the action 
 */
async function proxyAddToCart() {
  cartStore.addToCart(props.product, 'Unique', async (data) => {
    console.log('proxyAddToCart', data)

    if (cartStore.sessionCache) {
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

/**
 * Actions where the user selects a given size 
 * for a given product
 * 
 * @param size The item's size
 */
function proxySelectSize(size: DefaultClotheSize) {
  if (size) {
    showSizeSelectionWarning.value = false
    cartStore.handleSizeSelection(props.product, size)
  }
}
</script>
