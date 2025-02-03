<template>
  <q-page padding>
    <div class="row">
      <div class="col-10 offset-1">
        <PageHeader :current-product="currentProduct" :previous-product="previousProduct" :next-product="nextProduct" @save="handleSaveProduct" />

        <div class="row">
          <div class="col-8 q-pr-sm">
            <!-- Information -->
            <ProductInfo v-model="requestData.name" class="q-mb-sm" />

            <CategoryInfo v-model="requestData" class="q-mb-sm" />

            <!-- <q-card class="q-mb-sm">
              <q-card-section>
                <div v-if="requestData" class="block">
                  <q-input v-model="requestData.name" label="Product name" outlined />
                </div>
                <q-spinner-cube v-else size="lg" class="q-mr-sm" />
              </q-card-section>
            </q-card> -->

            <!-- <q-card class="q-mb-sm">
              <q-card-section>
                <div class="flex justify-left q-mb-sm">
                  <q-input class="q-pr-sm" style="width: 50%;" outlined />
                  <q-input style="width: 50%;" outlined />
                </div>

                <q-input outlined />
              </q-card-section>
            </q-card> -->

            <!-- Images -->
            <ImagesBlock :current-product="currentProduct" @update-product="handleUpdateProduct" @update-images="handleUpdateImages" />

            <!-- Sizes -->
            <SizeBlock v-model="requestData" />
          </div>

          <div class="col-4">
            <q-card>
              <div v-if="requestData" class="block">
                <q-card-section>
                  <q-toggle v-model="requestData.active" label="Active" />
                </q-card-section>
              </div>
              <q-spinner-cube v-else size="lg" class="q-mr-sm" />
            </q-card>
          </div>
        </div>

        {{ currentProduct }}
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { watchDeep } from '@vueuse/core'
import { AxiosError } from 'axios'
import { mapState, storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useDjangoUtilies } from 'src/composables/utils'
import { useShop } from 'src/stores/shop'
import { NewProduct, Product, ProductImage } from 'src/types'
import { defineComponent, provide, ref } from 'vue'

import ImagesBlock from 'src/components/product/ImagesBlock.vue'
import PageHeader from 'src/components/product/PageHeader.vue'
import ProductInfo from 'src/components/product/ProductInfo.vue'
import SizeBlock from 'src/components/product/SizeBlock.vue'
import CategoryInfo from 'src/components/product/CategoryInfo.vue'

export default defineComponent({
  name: 'ProductPage',
  components: {
    PageHeader,
    ImagesBlock,
    CategoryInfo,
    ProductInfo,
    SizeBlock
  },
  setup () {
    const { notify } = useQuasar()
    const store = useShop()
    const { currentProduct } = storeToRefs(store)

    const isSaving = ref(false)
    const requestData = ref<NewProduct>({
      id: 0,
      name: '',
      color: '',
      category: 'Not attributed',
      sub_category: 'Not attributed',
      sizes: [],
      sale_value: 0,
      sale_price: 0,
      on_sale: false,
      is_new: false,
      display_new: false,
      active: false
    })

    watchDeep(requestData, (product) => {
      if (product && requestData.value) {
        if (requestData.value.active !== product.active) {
          console.log(product)
        }
      }
    })

    const { mediaPath } = useDjangoUtilies()
    const showUploadImagesDialog = ref(false)

    provide('currentProduct', requestData)

    return {
      isSaving,
      notify,
      showUploadImagesDialog,
      mediaPath,
      currentProduct,
      requestData,
      store
    }
  },
  computed: {
    ...mapState(useShop, ['previousProduct', 'nextProduct'])
  },
  watch: {
    '$route.params.id' (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.requestProduct()
      }
    }
  },
  created () {
    this.requestProduct()
  },
  methods: {
    /***/
    async requestProduct () {
      try {
        const response = await this.$api.get(`/products/${this.$route.params.id}`)
        this.currentProduct = response.data
        this.requestData = response.data
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          this.notify({
            color: 'red-1',
            textColor: 'dark',
            closeBtn: true,
            position: 'bottom',
            message: 'Network error'
          })
        }
      }
    },
    /***/
    async handleSaveProduct () {
      try {
        this.isSaving = true
        const response = await this.$api.patch(`admin/products/${this.$route.params.id}`, this.requestData)
        this.currentProduct = response.data
        this.showUploadImagesDialog = false
        this.isSaving = false
        this.notify({
          color: 'dark',
          textColor: 'accent',
          message: 'Product saved',
          progress: true,
          timeout: 2000
        })
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          this.notify({
            color: 'red-1',
            textColor: 'dark',
            closeBtn: true,
            position: 'bottom',
            message: 'Failed to save product'
          })
        }
      }
    },
    /***/
    handleUpdateProduct (data: Product) {
      if (Object.keys(data).length > 0) {
        const index = this.store.products.findIndex(x => x.id === data.id)
        this.store.products[index] = data
      }
    },
    /***/
    handleUpdateImages (data: { product: Product, images: ProductImage[] }) {
      if (data.images.length > 0) {
        const index = this.store.products.findIndex(x => x.id === data.product.id)
        this.store.products[index].images = data.images
      }
    }
  }
})
</script>
