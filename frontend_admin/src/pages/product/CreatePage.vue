<template>
  <CreationLayout>
    <template #pageHeader>
      {{ newProduct }}
      <PageHeader :new-product="newProduct" @save="handleCreateProduct" />
    </template>

    <template #default>
      <!-- Product Information -->
      <ProductInfo v-model="newProduct.name" :for-creation="true" />
      <!-- Category Info -->
      <CategoryInfo v-model="newProduct" class="q-my-sm" />
      <!-- Images -->
      <ImagesBlock />
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
import type { NewProduct } from 'src/types'
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

async function handleCreateProduct() {
  try {
    const client = createClient()
    const response = await client.post('/admin/products/create', newProduct.value)
    if (response.status === 201) {
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
</script>
