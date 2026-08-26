<template>
  <create-layout>
    <template #pageHeader>
      <product-header @save="create" />
    </template>

    <template #default>
      <div class="space-y-2">
        <!-- Information -->
        <product-info v-model="newProduct" :for-creation="true" />

        <!-- Category -->
        <lazy-product-category v-model="newProduct" hydrate-on-idle />

        <!-- Images -->
        <lazy-product-images @associate-images="handleNewImages" hydrate-on-idle />
        
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
import type {  NewProduct, ProductImage, ProductNode } from '~/types'

const router = useRouter()

const imagesToAssociate = ref<ProductImage[]>([])
const newProduct = ref<NewProduct>({
  name: '',
  color: '',
  category: 'Not attributed',
  subCategory: 'Not attributed',
  unitPrice: 0,
  modelHeight: null,
  modelSize: null,
  sizes: [],
  saleValue: 0,
  salePrice: 0,
  onSale: false,
  isNew: false,
  active: false
})

/**
 * Create a new product
 */
async function create() {
  const data = await $fetch<ProductNode>('/admin/v1/products/create', {
    method: 'POST',
    body: newProduct.value
  })

  if (data) {
    router.push('/dashboard/products/' + data.node.id)
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
