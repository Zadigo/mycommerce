<template>
  <create-layout>
    <template #pageHeader>
      <product-header @save="create" />
    </template>

    <template #default>
      <div class="space-y-2">
        <product-info v-model="newProduct" :for-creation="true" />
        <product-category v-model="newProduct" />

        <product-images @associate-images="handleNewImages" />
        
        <!-- <suspense>
          <template #default>
            <product-images @associate-images="handleNewImages" />
          </template>

          <template #fallback>
            <p>Loading...</p>
          </template>
        </suspense> -->
      </div>
    </template>

    <template #pageAside>
      <nuxt-card>
        <nuxt-switch v-model="newProduct.active" label="Active" />
      </nuxt-card>
    </template>
  </create-layout>
</template>

<script setup lang="ts">
import type {  NewProduct, Product, ProductImage } from '~/types'

const router = useRouter()

const imagesToAssociate = ref<ProductImage[]>([])
const newProduct = ref<NewProduct>({
  name: '',
  color: '',
  category: 'Not attributed',
  sub_category: 'Not attributed',
  unit_price: '0',
  model_height: null,
  model_size: null,
  sizes: [],
  sale_value: 0,
  sale_price: 0,
  on_sale: false,
  is_new: false,
  active: false
})

/**
 * Create a new product
 */
async function create() {
  const data = await $fetch<Product>('/admin/v1/products/create', {
    method: 'POST',
    body: newProduct.value
  })

  if (data) {
    router.push('/dashboard/products/' + data.id)
  }
}

/**
 * Handle new images
 * @param images Images to create
 */
function handleNewImages (images: ProductImage[]) {
  imagesToAssociate.value = images
}
</script>
