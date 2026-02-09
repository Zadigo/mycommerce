<template>
  <div id="actions">    
    <!-- Size selection -->
    <product-size-block v-if="product" :selected-size="selectedSize" :product="product" class="mb-4" @select-size="(size) => { selectSize(size) }" />
    <volt-skeleton v-else height="100px" class="w-2/6" />

    {{ selectedSize }}

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

    <volt-button v-if="isDefined(selectedSize) && !selectedSize.availability" id="action-inform" class="mt-5 place-content-center" @click="() => emit('availability-modal')">
      <icon name="fa:envelope" size="12" class="me-1" />
      {{ $t('Me tenir informer') }}
    </volt-button>
    <volt-button v-else id="action-add-cart" class="mt-5 me-2 place-content-center" :disabled="false" @click="() => { createItem(product, selectedSize, successCallback, () => { toggleSizeSelectionWarning(true) }) }">
      <!-- <icon v-if="stockState && stockState.almost_sold_out" name="i-fa7-solid:clock" class="me-1" /> -->
      {{ $t('Ajouter au panier') }}
    </volt-button>

    <volt-button id="action-add-favorite" :aria-label="$t('Ajouter au favori')" class="mt-5" variant="outline" @click="async () => { await like() }">
      <client-only>
        <template #default>
          {{ icon }}
          <icon :name="icon" />
        </template>

        <template #fallback>
          <icon name="fa7-solid:heart" />
        </template>
      </client-only>
    </volt-button>
  </div>
</template>

<script setup lang="ts">
import { promiseTimeout, type Arrayable } from '@vueuse/core'
import type { CartItem, ProductNode, Undefineable } from '~/types'

const props = defineProps<{ product: ProductNode }>()
const emit = defineEmits<{ 'size-guide': [], 'availability-modal': [] }>()

// const stockState = inject<ProductStockApiResponse>('stockState')

// const cartStore = useCart()
// const { userSelection, showSizeSelectionWarning } = storeToRefs(cartStore)

/**
 * Like
 */

const { like, icon } = await useLikeComposable(props.product)

/**
 * Size Selection
 */

const { selectedSize, hasSelection, selectSize } = useSizeSelection(props.product)

/**
 * Payment Intent
 */

const { hasPaymentIntent, create } = usePaymentIntentComposable()
const { update } = useDjangoCartComposable()

/**
 * Cart
 */

const [showSizeSelectionWarning, toggleSizeSelectionWarning] = useToggle(false)
const { createItem } = useCartComposable(hasSelection)

const showAddedProductDrawer = useState<boolean>('showAddedProductDrawer')

async function successCallback(_: Ref<Arrayable<CartItem>>, total: Undefineable<number>) {
  showAddedProductDrawer.value = true
  await update()
  await promiseTimeout(5000)
  await create(total)
}
</script>
