<template>
  <section id="product" class="mt-3 relative">
    <DevOnly>
      <div class="fixed top-2 left-0 w-2/4 z-50 bg-yellow-200 rounded-md shadow-md p-10">
        {{ product?.id }}
      </div>
    </DevOnly>

    <div class="grid grid-cols-12 grid-row-1 w-full gap-5">
      <!-- Images -->
      <template v-if="product">
        <component :is="imagesComponent" :images="product.images" :product="product" @zoom-image="handleSelectedImage" />
      </template>
      
      <!-- Details -->
      <ProductDetailsAside v-if="product" :product="product" :is-loading="isLoading" @show-size-guide="showSizeGuideDrawer=true" />
    </div>

    <!-- Recommendations -->
    <div id="recommendations" class="mt-20">
      <Suspense>
        <AsyncBaseRecommendationBlock />

        <template #fallback>
          <BaseLoadingRecommendations :quantity="30" />
        </template>
      </Suspense>
    </div>

    <ClientOnly>
      <div v-if="showBanner" :class="{ 'translate-y-0 opacity-10': !showBanner, 'translate-y-0 opacity-100': showBanner }" class="bg-white p-2 rounded-md shadow-md fixed bottom-5 w-7/12 mx-auto left-1/4 h-auto transition-all ease z-50">
        <div v-if="product" class="flex justify-between">
          <div class="flex justify-start gap-3 align-center self-center">
            <img :src="product.get_main_image.original" :alt="product.color_variant_name" class="w-10 rounded-md">
            
            <div class="flex flex-col">
              <p class="font-normal text-sm">
                {{ product.name }}
              </p>
              <p class="font-bold">
                {{ translatePrice(product.unit_price) }}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <DevOnly>
              {{ y }}
            </DevOnly>

            <BaseSelect v-model="userSelection.size" :items="sizeNames" item-key="name" item-value="name" />
            <BaseButton @click="addToCart(product)">
              {{ $t('Ajouter au panier') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Banner -->
    <!--
    <ClientOnly>
      <BaseModal v-model="zoomImage" fullscreen>
        <BaseCard>
          <div v-if="product && selectedImage" class="relative rounded-md">
            <div class="flex absolute top-0 right-0 gap-2 z-40 p-5 bg-white">
              <img v-for="image in product.images" :key="image.id" :src="image.original" :alt="image.name" width="70" :class="{ 'opacity-50': selectedImage.id === image.id}" class="cursor-pointer" @click="selectedImage=image">
            </div>
            
            <img :src="selectedImage.original" :alt="selectedImage.name" class="w-full cursor-zoom-out" @click="zoomImage=false">
          </div>
        </BaseCard>
      </BaseModal>
    </ClientOnly>

    <ClientOnly>
      <BaseOffcanvas v-model="sizeGuide" />
    </ClientOnly>

    <ClientOnly>
      <BaseModal v-model="availabilityModal">
        <h2 class="text-2xl font-semibold mb-3">
          La taille "{{ selectedSize }}" n'est plus en stock
        </h2>

        <p class="font-light">
          Renseignes ton adresse e-mail dans le champ 
          ci-dessous pour être averti lorsque cet article est 
          de retour en stock
        </p>

        <form class="mt-4" @submit.prevent>
          <BaseInput v-model="emailForAvailability" input-type="email" class="w-full block" placeholer="Addresse email" />
          <BaseButton color="primary" class="w-full block">
            S'inscrire
          </BaseButton>
        </form>
      </BaseModal>
    </ClientOnly>

    <ClientOnly>
      <BaseModal v-model="showCart">
        <BaseCard>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores debitis 
          porro quasi adipisci similique tempore accusamus cupiditate magnam ipsa repellat. 
          Possimus molestias voluptas ipsam iste quisquam distinctio minus, delectus aperiam.
        </BaseCard>
      </BaseModal>
    </ClientOnly> -->

    <ClientOnly>
      <ModalsImageZoom v-model="showModal" :product="product" :image="selectedImage" @select-image="handleSelectedImage" />
      <ModalsSizeGuide v-model="showSizeGuideDrawer" :product="product" />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import type { Product, ProductStock } from '~/types'

type ImageComponentMap = {
  [key: number]: Component
}

const FiveImages = defineAsyncComponent(() => import('~/components/product/details/FiveImages.vue'))
const SixImages = defineAsyncComponent(() => import('~/components/product/details/SixImages.vue'))
const NoImages = defineAsyncComponent(() => import('~/components/product/details/NoImages.vue'))

const AsyncBaseRecommendationBlock = defineAsyncComponent({
  loader: async () => import('~/components/BaseRecommendations.vue'),
  timeout: 5000
})

const { $client } = useNuxtApp()

// Composable for product fetching
function useProductDetails () {
  const { id } = useRoute().params

  /**
   * WRITE DOCUMENTATION
   */
  const { data, status } = useFetch<Product>(`/api/products/${id}`, {
    method: 'GET',
    transform(data) {
      try {
        const validItem = ProductSchema.parse(data)
      } catch (e) {
        console.log('Could not validate prouct', e)
      }

      return data
    },
    onResponseError({ error }) {
      createError({
        statusMessage: error?.message,
        statusCode: 404
      })
    }
  })
  // const product = computed(() => data.value)
  const isLoading = computed(() => status.value === 'pending')

  provide('isLoading', isLoading)

  return {
    product: data,
    isLoading
  }
}

/**
 * This composable checks the stock for the given product
 * and then allows use to indicate whether the product is
 * available or not 
 */
function useProductStock (product: Ref<Product | null>) {
  const stockState = ref<ProductStock>()
  const { handleError } = useErrorHandler()

  async function requestProductStock () {
    try {
      if (product.value) {
        const response = await $client.get<ProductStock>(`stocks/products/${product.value.id}`)
        stockState.value = response.data
      }
    } catch (e) {
      handleError(e)
    }
  }

  provide('stockState', stockState)

  return {
    stockState,
    requestProductStock
  }
}

/**
 * Composable for tracking visited products
 */
function useVisitedProducts (product: Ref<Product | null>) {
  const visitedProducts = useLocalStorage<number[]>('visited', null, {
    serializer: {
      read: (raw) => JSON.parse(raw),
      write: (value) => JSON.stringify(value)
    }
  })
  
  function trackProduct () {
    if (product.value) {
      if (visitedProducts.value) {
        visitedProducts.value.push(product.value.id)
      } else {
        visitedProducts.value = [product.value.id]
      }
    }
  }

  return {
    trackProduct
  }
}

// TODO: Refactor into a composable
const moreProductsIntersect = ref<HTMLElement>()
const showSizeGuideDrawer = ref(false)
const isLargeScreen = useMediaQuery('(min-width: 320px)')
const { y } = useScroll(window)

const { translatePrice } = useShopComposable()
const { product, isLoading } = useProductDetails()
const { trackProduct } = useVisitedProducts(product)
const { requestProductStock } = useProductStock(product)
const { userSelection, addToCart } = useCartComposable()
const { showModal, selectedImage, handleSelectedImage, handleCloseSelection } = useImages()
// const { gtag } = useGtag()
const shopStore = useShop()

useHead({
  title: () => product.value?.name ?? 'Product Details',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

useSchemaOrg([
  defineProduct({
    '@id': product.value?.name,
    name: product.value?.name,
    description: '',
    image: product.value?.get_main_image?.original,
    offers: [
      {
        price: product.value?.sale_price
      }
    ]
  })
])

const imageComponentMap: ImageComponentMap = {
  5: FiveImages,
  6: SixImages
}

const showBanner = computed(() => y.value >= 1200 && y.value <= 2100)
const sizeNames = computed(() => {
  if (product.value) {
    return product.value.sizes.map(x => x.name)
  } else {
    return []
  }
})
const imagesComponent = computed((): Component => {
  if (!product.value) {
    return NoImages
  } else {
    const numberOfImages = product.value.images.length
    return imageComponentMap[numberOfImages] || NoImages
  }
})

onBeforeMount(() => {
  nextTick(trackProduct)
})

onMounted(async () => {
  await requestProductStock()

  if (product.value) {
    // gtag('event', 'view_item', {
    //   items: [
    //     {
    //       item_id: product.value.id,
    //       item_name: product.value.name,
    //       price: product.value.get_price,
    //       item_brand: null,
    //       item_category: product.value.category,
    //       index: shopStore.currentProductIndex
    //     }
    //   ]
    // })
  }
})
</script>
