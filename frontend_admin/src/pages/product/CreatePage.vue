<template>
  <CreationLayout>
    <template #pageHeader>
      {{ newProduct }}
      <PageHeader :new-product="newProduct" @save="handleCreateProduct" />
    </template>

    <template #default>
      <ProductInfo v-model="newProduct.name" :for-creation="true" />
      <CategoryInfo v-model="newProduct" class="q-my-sm" />
      <ImagesBlock @associate-images="handleNewImages" />
    </template>

    <template #pageAside>
      <q-card>
        <q-card-section>
          <q-toggle v-model="newProduct.active" label="Active" />
        </q-card-section>
      </q-card>
    </template>
  </CreationLayout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAxiosClient } from 'src/composables/utils'
import type { NewProduct, Product, ProductImage } from 'src/types'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import CategoryInfo from 'src/components/product/CategoryInfo.vue'
import ImagesBlock from 'src/components/product/ImagesBlock.vue'
import PageHeader from 'src/components/product/PageHeader.vue'
import ProductInfo from 'src/components/product/ProductInfo.vue'
import CreationLayout from 'src/layouts/CreationLayout.vue'

const { createClient } = useAxiosClient()

const { notify } = useQuasar()
const router = useRouter()

const imagesToAssociate = ref<ProductImage[]>([])
const newProduct = ref<NewProduct>({
  name: '',
  color: '',
  category: 'Not attributed',
  sub_category: 'Not attributed',
  unit_price: 0,
  model_height: null,
  model_size: null,
  sizes: [],
  sale_value: 0,
  sale_price: 0,
  on_sale: false,
  is_new: false,
  active: false
})

async function handleCreateProduct () {
  try {
    const client = createClient()
    const response = await client.post<Product>('/admin/products/create', newProduct.value)

    if (response.status === 201) {
      // Once we know that the product is created,
      // call this endpint in order to associate
      // the product to the new images
      if (imagesToAssociate.value.length > 0) {
        const response2 = await client.post('/admin/images/associate', {
          product: response.data.id,
          images: imagesToAssociate.value.map(x => x.id)
        })

        if (response2.status === 201) {
          router.push({ name: 'products_view' })
          return
        }
      }

      router.push({ name: 'products_view' })
    }
  } catch (e) {
    console.error(e)
    // notify({
    //   color: 'red-1',
    //   textColor: 'dark',
    //   closeBtn: true,
    //   position: 'bottom',
    //   message: 'Failed to cretae product'
    // })
  }
}

function handleNewImages (images: ProductImage[]) {
  imagesToAssociate.value = images
}
</script>
