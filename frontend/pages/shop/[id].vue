<template>
  <section id="product" class="relative">
    <div class="grid grid-cols-12 grid-row-1 w-full gap-5">
      <!-- Images -->
      <template v-if="product">
        <component :is="imagesComponent" :images="product.images" :product="product" @zoom-image="handleSelectedImage" />
      </template>
      
      <!-- Details -->
      <ProductPageAsideBase v-if="product" :product="product" @show-size-guide="showSizeGuideDrawer=true" />
    </div>

    <!-- Recommendations -->
    <div id="recommendations" class="mt-10">
      <Suspense>
        <AsyncBaseRecommendationBlock />

        <template #fallback>
          <BaseLoadingRecommendations :quantity="30" />
        </template>
      </Suspense>
    </div>

    <ClientOnly>
      <ProductPageBottomCart v-if="showBanner && product" :y="y" :product="product" :show-banner="showBanner" />
      <ModalsImageZoom v-model="showModal" :product="product" :image="selectedImage" @select-image="handleSelectedImage" />
      <ModalsSizeGuide v-model="showSizeGuideDrawer" :product="product" />
    </ClientOnly>

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
  </section>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import type { Product, ProductStock } from '~/types'

type ImageComponentMap = {
  [key: number]: Component
}

const FiveImages = defineAsyncComponent(() => import('~/components/product/page/images/Five.vue'))
const SixImages = defineAsyncComponent(() => import('~/components/product/page/images/Six.vue'))
const NoImages = defineAsyncComponent(() => import('~/components/product/page/images/Empty.vue'))

const AsyncBaseRecommendationBlock = defineAsyncComponent({
  loader: async () => import('~/components/BaseRecommendations.vue'),
  timeout: 5000
})

const { $client } = useNuxtApp()

const { id } = useRoute().params

/**
 * WRITE DOCUMENTATION
 */
const { data: product, status } = useFetch<Product>(`/api/products/${id}`, {
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

const isLoading = computed(() => status.value === 'pending')

provide('isLoading', isLoading)

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
        const response = await $client.get<ProductStock>(`/api/v1/stocks/products/${product.value.id}`)
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

// useSchemaOrg([
//   defineProduct({
//     '@id': product.value?.name,
//     name: product.value?.name,
//     description: '',
//     image: product.value?.get_main_image?.original,
//     offers: [
//       {
//         price: product.value?.sale_price
//       }
//     ]
//   })
// ])

const imageComponentMap: ImageComponentMap = {
  5: FiveImages,
  6: SixImages
}

const showBanner = computed(() => y.value >= 1200 && y.value <= 2100)

const imagesComponent = computed((): Component => {  
  if (!product.value) {
    return NoImages
  } else if (product && product.value.images.length === 0) {
    return NoImages
  }else {
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
