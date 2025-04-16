<template>
  <article v-if="product" :data-id="product.id" :aria-label="product.name" class="relative" @mouseover="isHovered=true" @mouseleave="isHovered=false">
    <!-- Carousel -->
    <div class="relative">
      <button v-if="showCarousel && isHovered" type="button" class="absolute top-2/5 left-3 py-5 rounded-full z-10 w-5 place-content-center hover:opacity-60 flex" @click="handlePreviousImage">
        <Icon name="fa:caret-left" class="" />
      </button>
      
      <NuxtLink :to="`/shop/${product.id}`" @click="emit('has-navigated', [index, product])">
        <img v-if="currentImage" :src="mediaPath(currentImage?.original, '/placeholder.svg')" :alt="currentImage?.name" :aria-label="currentImage?.name" class="self-center aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-full">
        <TailSkeleton v-else class="w-full h-[188px] md:h-[423px] bg-gray-100 rounded-md" />
      </NuxtLink>

      <button v-if="showCarousel && isHovered" type="button" class="absolute top-2/5 right-3 py-5 rounded-full z-10 w-5 place-content-center hover:opacity-60" @click="handleNextImage">
        <Icon name="fa:caret-right" class="" />
      </button>
    </div>
    
    <!-- Cart -->
    <div v-show="showCart && isHovered" class="absolute w-full flex justify-center align-middle transition-all ease-in-out z-30 invisible lg:visible lg:bottom-[3.5rem]">
      <div class="bg-white rounded-md py-5 w-5/6">
        <p class="font-light text-sm text-center mb-3">
          {{ $t("Sélectionne la taille") }}
        </p>

        <div v-if="requiresSizeItems" class="flex justify-center flex-wrap gap-2">
          <button v-for="size in product.sizes" :key="size.id" :aria-label="size.name" type="button" class="py-1 px-1 text-sm flex gap-1 place-items-center underline-offset-4 transition-all duration-200 hover:underline hover:font-semibold" @click="handleAddToCart(size.name)">
            <Icon v-if="!size.availability" name="fa-regular:clock" size="11" class="text-orange-400" />
            <span>{{ size.name }}</span>
          </button>
        </div>

        <v-btn v-else variant="plain" color="dark" block rounded @click="handleAddToCart('Unique')">
          {{ $t('Ajouter au panier') }}
        </v-btn>
      </div>
    </div>

    <div v-if="showPrices" class="mt-4 flex justify-between align-top gap-5">
      <div id="price">
        <h3 class="text-sm text-gray-700">
          <NuxtLink :to="`/shop/${product.id}`" @click="emit('has-navigated', [index, product])">
            <span aria-hidden="true" class="absolute inset-0" />
            {{ product.name }}
          </NuxtLink>
        </h3>
        
        <p v-if="typeof product.get_price === 'number'" class="font-semibold text-sm">
          {{ $n(product.get_price, 'currency') }}
        </p>

        <p v-else class="font-semibold text-sm">
          {{ $n(parseFloat(product.get_price), 'currency') }}
        </p>
      </div>
      
      <!-- <p class="text-sm font-medium text-gray-900">
        35€
      </p> -->
      <div class="flex align-center">
        <button type="button" class="bg-white rounded-full p-2" @click="proxyHandleLike">
          <Icon v-if="isLiked" name="fa:heart" size="13" />
          <Icon v-else name="fa-regular:heart" size="13" />
        </button>
      </div>
    </div>
  </article>

  <article v-else>
    <BaseSkeleton :loading="true" height="427px" />
    <BaseSkeleton :loading="true" height="10px" />
    <BaseSkeleton :loading="true" height="10px" width="50px" />
  </article>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import type { PropType } from 'vue';
import type { Product } from '~/types';

const props = defineProps({
  index: {
    type: Number,
    required: false,
    default: null
  },
  product: {
    type: Object as PropType<Product>,
    required: true
  },
  showLikeButton: {
    type: Boolean,
    default: true
  },
  showCarousel: {
    type: Boolean,
    default: true
  },
  showCart: {
    type: Boolean,
    default: true
  },
  showPrices: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits({
  /** 
   * This emit is used to indicate to parents
   * hosting this component that a navigation occured. This
   * is useful for Google Analytics for example or for passing
   * information on a product on which the link was clicked
   */
  'has-navigated'(_data: (number | Product)[]) {
    return true
  }
})

const cartStore = useCart()
// const { gtag } = useGtag()
const { showAddedProductDrawer } = storeToRefs(cartStore)
const { handleLike, isLiked } = useShopComposable()
const { addToCart } = useCartComposable()
const { mediaPath } = useDjangoUtilies()

const likedProducts = useLocalStorage<number[]>('likedProducts', [], {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const currentIndex = ref<number>(0)
const isHovered = ref(false)
const cardCoverEl = ref<HTMLElement>()

const numberOfImages = computed(() => props.product.images?.length || 0)
const currentImage = computed(() => {
  if (props.product.images) {
    return props.product.images[currentIndex.value]
  }
  return null
})
const requiresSizeItems = computed(() => {
  if (props.product) {
    return props.product.sizes.length > 0
  } else {
    return false
  }
})

async function handleAddToCart (size?: string | number) {
  if (props.product) {
    await addToCart(props.product,  size, (data) => {
      showAddedProductDrawer.value = true

      if (cartStore.sessionCache) {
        cartStore.sessionCache.cart = data
      }
    })
  } else {
    console.error('Card', 'Props does not have a product')
  }
}

function proxyHandleLike () {
  const result = handleLike(likedProducts.value, props.product)
  console.log('handleLike', likedProducts.value, result)
  likedProducts.value = result
  isLiked.value = !isLiked.value
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

function handlePreviousImage() {
  const nextIndex = currentIndex.value - 1
  if (nextIndex <= 0) {
    currentIndex.value = numberOfImages.value - 1
  } else {
    currentIndex.value = nextIndex
  }
}

function handleNextImage() {
  const nextIndex = currentIndex.value + 1
  if (nextIndex >= numberOfImages.value) {
    currentIndex.value = 0
  } else {
    currentIndex.value = nextIndex
  }
}

onMounted(() => {
  if (props.product) {
    isLiked.value = likedProducts.value.includes(props.product.id)
  }
})
</script>
