<template>
  <q-page padding>
    <div class="row">
      <div class="col-10 offset-1">
        <header class="row">
          <div class="col-12">
            <q-card class="q-mb-sm">
              <q-card-section>
                <div class="flex justify-between align-center">
                  <div class="flex justify-left">
                    <q-btn v-if="previousProductId" :to="{ name: 'product_view', params: { id: previousProductId.id }, query: { id: previousProductId.id } }" class="q-mr-sm text-black" color="grey-1" round unelevated>
                      <q-icon size="1em" name="fas fa-arrow-left" />
                    </q-btn>

                    <q-btn v-if="nextProductId" :to="{ name: 'product_view', params: { id: nextProductId.id }, query: { id: nextProductId.id } }" class=" text-black" color="grey-1" round unelevated>
                      <q-icon size="1em" name="fas fa-arrow-right" />
                    </q-btn>
                  </div>

                  <q-btn color="primary" unelevated rounded @click="handleSaveProduct">
                    <q-spinner-cube v-if="isSaving" size="xs" color="white" class="q-mr-sm" />
                    Save
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </header>

        <div class="row">
          <div class="col-8 q-pr-sm">
            <q-card class="q-mb-sm">
              <q-card-section>
                <div v-if="requestData" class="block">
                  <q-input v-model="requestData.name" label="Product name" outlined />
                </div>
                <q-spinner-cube v-else size="lg" class="q-mr-sm" />
              </q-card-section>
            </q-card>

            <q-card class="q-mb-sm">
              <q-card-section>
                <div class="flex justify-left q-mb-sm">
                  <!-- <q-input class="q-pr-sm" style="width: 50%;" outlined />
                  <q-input style="width: 50%;" outlined /> -->
                </div>

                <!-- <q-input outlined /> -->
              </q-card-section>
            </q-card>

            <!-- Images -->
            <ImagesBlock @update-product="handleUpdateProduct" @update-images="handleUpdateImages" />

            <!-- Sizes -->
            <SizeBlock />
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
import { Product, ProductImage } from 'src/types'
import { defineComponent, provide, ref } from 'vue'

import ImagesBlock from 'src/components/product/ImagesBlock.vue'
import SizeBlock from 'src/components/product/SizeBlock.vue'

export default defineComponent({
  name: 'ProductPage',
  components: {
    ImagesBlock,
    SizeBlock
  },
  setup () {
    const { notify } = useQuasar()
    const store = useShop()
    const { currentProduct } = storeToRefs(store)

    const isSaving = ref(false)
    const requestData = ref<Product | undefined>()

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
    ...mapState(useShop, ['previousProductId', 'nextProductId'])
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
        const response = await this.$api.get(`admin/products/${this.$route.params.id}`)
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
