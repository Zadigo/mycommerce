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
                    <q-btn :to="{ name: 'product_view', params: { id: previousProductId.id }, query: { id: previousProductId.id } }" class="q-mr-sm text-black" color="grey-1" round unelevated>
                      <q-icon size="1em" name="fas fa-arrow-left"></q-icon>
                    </q-btn>

                    <q-btn :to="{ name: 'product_view', params: { id: nextProductId.id }, query: { id: nextProductId.id } }" class=" text-black" color="grey-1" round unelevated>
                      <q-icon size="1em" name="fas fa-arrow-right"></q-icon>
                    </q-btn>
                  </div>

                  <q-btn color="primary" unelevated rounded @click="handleSaveProduct">
                    <q-spinner-cube size="xs" color="white" class="q-mr-sm" />
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
                <q-input v-model="requestData.name" label="Product name" outlined></q-input>
              </q-card-section>
            </q-card>

            <q-card class="q-mb-sm">
              <q-card-section>
                <div class="flex justify-left q-mb-sm">
                  <q-input class="q-pr-sm" style="width: 50%;" outlined></q-input>
                  <q-input style="width: 50%;" outlined></q-input>
                </div>

                <q-input outlined></q-input>
              </q-card-section>
            </q-card>

            <q-card class="q-mb-sm">
              <q-card-section>
                <h2 class="text-h6 q-ma-none">Product images</h2>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div v-if="currentProduct.images?.length > 0" class="row q-gutter-sm flex justify-center">
                  <div v-for="image in currentProduct.images" :key="image.id" class="col-3">
                    <q-img :src="djangoMediaPath(image.original)" width="100">
                      <div class="absolute-bottom text-h6">
                        <q-btn color="primary" size="sm">
                          <q-icon name="delete"></q-icon>
                        </q-btn>
                      </div>
                    </q-img>
                  </div>
                </div>

                <div v-else class="row q-gutter-sm flex justify-center">
                  <q-btn class="q-my-md" color="primary" size="xl" rounded @click="showUploadImagesDialog = true">
                    <q-icon name="upload" class="q-mr-sm" /> Add images
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>

            <q-card>
              <q-card-section>
                <div class="flex justify-left">
                  <q-input style="width: 25%;" outlined></q-input>
                  <q-input class="q-px-sm" style="width: 25%;" outlined></q-input>
                  <q-input style="width: 25%;" outlined></q-input>
                  <q-btn class="text-black q-mx-sm" color="grey-1" unelevated><q-icon name="fas fa-plus"></q-icon></q-btn>
                  <q-btn class="text-black" color="grey-1" unelevated><q-icon name="fas fa-minus"></q-icon></q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-4">
            <q-card>
              <q-card-section>
                <q-toggle v-model="requestData.active" label="Active"></q-toggle>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <q-dialog v-model="showUploadImagesDialog">
      <q-card style="width: 600px;">
        <q-card-section>
          <h2 class="text-h6 q-ma-none">Upload images</h2>
        </q-card-section>

        <q-separator></q-separator>

        <q-card-section>
          <q-input v-model="selectedFilesBaseName" class="q-mb-sm" outlined></q-input>
          <q-file v-model="selectedFiles" :multiple="true" outlined label="Outlined" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat @click="showUploadImagesDialog = false">
            Cancel
          </q-btn>
          
          <q-btn color="primary" @click="uploadImagesToProduct(currentProduct, data => currentProduct.images = data)">
            <q-spinner-cube size="xs" color="white" class="q-mr-sm" />
            <q-icon name="upload" class="q-mr-sm"></q-icon>
            Upload
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { syncRef, watchDeep } from '@vueuse/core'
import { useShop } from '../stores/shop'
import { mapState, storeToRefs } from 'pinia'
import { useImagesUpload } from 'src/composables/admin'
import { useUtilities } from 'src/composables/admin'

export default {
  name: 'ProductPage',
  setup () {
    const store = useShop()
    const { currentProduct } = storeToRefs(store)

    const requestData = ref({})
    syncRef(requestData, currentProduct, { direction: 'rtl' })


    watchDeep(requestData, (updated) => {
      if (requestData.value.active !== updated.active) {
        console.log(updated)
      }
    })
    
    const { djangoMediaPath } = useUtilities()
    const showUploadImagesDialog = ref(false)
    const { selectedFiles, selectedFilesBaseName, handleUploadImages, uploadImagesToProduct } = useImagesUpload()

    return {
      selectedFiles,
      selectedFilesBaseName,
      uploadImagesToProduct,
      handleUploadImages,
      showUploadImagesDialog,
      djangoMediaPath,
      currentProduct,
      requestData,
      store
    }
  },
  computed: {
    ...mapState(useShop, ['previousProductId', 'nextProductId']),
    isForUpdate () {
      // Indicates that we are going to currently
      // update an existing product
      return this.$route.query.id !== null
    }
  },
  watch: {
    '$route.params.id' (n, o) {
      if (n !== o) {
        this.requestProduct()
      }
    }
  },
  created () {
    // TODO: If we reach directly on this page products were
    // not already retrieved, we need get them
    this.store.products = this.$session.retrieve('products')
    this.requestProduct()
  },
  methods: {
    async requestProduct () {
      try {
        const response = await this.$api.get(`shop/products/${this.$route.params.id}`)
        this.currentProduct = response.data
      } catch (e) {
        console.error(e)
      }
    },
    async handleSaveProduct () {
      try {
        const response = await this.$api.post(`shop/products/${this.$route.params.id}/update`, this.requestData)
        this.currentProduct = response.data
        this.showUploadImagesDialog = false
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
