<template>
  <q-layout view="lHh Lpr lFf" class="bg-white">
    <q-page padding>
      <div class="row">
        <!-- Header -->
        <header class="col-12">
          <q-card class="q-mb-md" flat>
            <q-card-section>
              <div class="flex justify-between align-center">
                <q-input v-model="searchedData.name" debounce="500" placeholder="Search images..." style="width: 50%;" outlined @keypress="handleSearchImages">
                  <template v-slot:prepend>
                    <q-icon name="fas fa-search" />
                  </template>
                </q-input>

                <q-btn color="black" unelevated>
                  <q-icon name="fas fa-filter" size="1em" rounded />

                  <q-menu>
                    <q-list>
                      <q-item v-for="(column, i) in filteringColumns" :key="i" v-close-popup clickable @click="handleAddFilter(column)">
                        {{ $t(column) }}
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-card-section>

            <!-- Filters -->

          </q-card>

          <q-card class="q-mb-lg">
            <q-card-section>
              <q-btn :rounded="true" color="blue-12" flat @click="showUploadImagesDialog = true">
                Upload images
              </q-btn>

              <q-btn :rounded="true" color="blue-12" flat :disable="!enableProductAssociationButton" @click="showProductAssociationDialog = true">
                Associate images
              </q-btn>

              <q-btn :active="columnDisplay===true" rounded unelevated @click="columnDisplay=true">
                <q-icon name="fas fa-table" />
              </q-btn>

              <q-btn :active="columnDisplay!==true" rounded unelevated @click="columnDisplay=false">
                <q-icon name="fas fa-list" />
              </q-btn>
            </q-card-section>
          </q-card>
        </header>

        <!-- Images -->
        <div class="col-12">
          <ColumnDisplay v-if="columnDisplay" :images="images" @select-image="(data) => selectedImages = data" />
          <ListDisplay v-else :images="images" />
        </div>

        <!-- Modals -->
        <q-dialog v-model="showUploadImagesDialog">
          <q-card style="width:700px;">
            <q-card-section>
              <h2 class="text-h5 q-ma-none">Upload images</h2>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-form @submit.prevent>
                <q-input v-model="selectedFilesBaseName" class="q-mb-sm" placeholder="File names" outlined />
                <q-file v-model="selectedFiles" :multiple="true" label="Select files" clearable outlined />
              </q-form>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat @click="showUploadImagesDialog = false">
                Cancel
              </q-btn>

              <q-btn :loading="isUploading" color="primary" flat @click="handleUploadImages">
                <q-icon name="upload" class="q-mr-sm" />
                Upload
              </q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="showProductAssociationDialog">
          <q-card style="width:400px;">
            <q-card-section>
              <h2 class="text-h5 q-ma-none">
                Select a product
              </h2>
            </q-card-section>

            <q-card-section>
              <q-select v-model="productToAssociate" :options="searchedProducts" option-label="name" option-value="id" filled use-input hide-selected fill-input input-debounce="0" label="Select a product" @filter="handleFilterProducts" @filter-abort="abortFilterProducts">
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat @click="showProductAssociationDialog = false">
                Cancel
              </q-btn>

              <q-btn flat @click="handleProductAssociation">
                Associate ({{ selectedImages.length }}) images
              </q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page>
  </q-layout>
</template>

<script lang="ts">
import _ from 'lodash'

import { useSessionStorage, whenever } from '@vueuse/core'
import { AxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useDjangoUtilies } from 'src/composables/utils'
import { useShop } from 'src/stores/shop'
import { Product, ProductImage } from 'src/types'
import { defineComponent, ref, computed } from 'vue'

import ColumnDisplay from 'src/components/images/ColumnDisplay.vue'
import ListDisplay from 'src/components/images/ListDisplay.vue'

interface FileElement {
  name: string,
  content: File | Blob | null
}

interface RequestData {
  files: FileElement[]
}

interface ImageFilters {
  column: string
  operator: 'Equals' | 'Not equal'
  value: string
}

export default defineComponent({
  name: 'ImagesPage',
  components: {
    ColumnDisplay,
    ListDisplay
  },
  setup () {
    const { notify } = useQuasar()
    const { mediaPath } = useDjangoUtilies()

    const shop = useShop()
    const { images } = storeToRefs(shop)

    const searchedData = ref({
      name: null
    })
    const imageFilters = ref<ImageFilters[]>([])
    const filteringColumns = [
      'Name'
    ]

    const showUploadImagesDialog = ref(false)

    const requestData = ref<RequestData>({
      files: [
        {
          name: '',
          content: null
        }
      ]
    })

    const selectedFiles = ref<File[]>([])
    const selectedFilesBaseName = ref(null)

    const selectedImages = ref<ProductImage[]>([])
    const enableProductAssociationButton = ref(false)
    const showProductAssociationDialog = ref(false)
    const searchedProducts = ref<Product[]>([])
    const productToAssociate = ref<Product | null>(null)

    const isUploading = ref(false)
    const cachedImages = useSessionStorage('images', null, {
      serializer: {
        read (raw) {
          return JSON.parse(raw)
        },
        write (value) {
          return JSON.stringify(value)
        }
      }
    })
    const columnDisplay = ref(true)

    const hasSelectedImages = computed(() => {
      return selectedImages.value.length > 0
    })

    whenever(hasSelectedImages, (newValue) => {
      if (newValue) {
        enableProductAssociationButton.value = true
      } else {
        enableProductAssociationButton.value = false
      }
    })

    return {
      columnDisplay,
      cachedImages,
      isUploading,
      selectedFilesBaseName,
      notify,
      selectedFiles,
      searchedProducts,
      productToAssociate,
      enableProductAssociationButton,
      showProductAssociationDialog,
      selectedImages,
      mediaPath,
      requestData,
      showUploadImagesDialog,
      filteringColumns,
      searchedData,
      imageFilters,
      images
    }
  },
  created () {
    this.requestImages()
  },
  methods: {
    /***/
    async handleUploadImages () {
      try {
        const formData = new FormData()

        this.isUploading = true
        this.selectedFiles.forEach((file, i) => {
          formData.append('files', file, file.name)
          formData.append('file_names', `${this.selectedFilesBaseName} ${i}`)
        })

        const response = await this.$api.post('/images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        this.images = response.data
        this.selectedFiles = []
        this.selectedFilesBaseName = null
        this.showUploadImagesDialog = false
        this.isUploading = false
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          // Handle
        }
      }
    },
    /***/
    async requestImages () {
      try {
        const response = await this.$api.get<ProductImage[]>('/images', {
          params: this.searchedData
        })
        this.images = response.data
        this.cachedImages = response.data
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          // Handle
        }
      }
    },
    /***/
    async handleSearchProducts (search: string) {
      try {
        const response = await this.$api.get<Product[]>('/products', {
          params: {
            q: search
          }
        })
        this.searchedProducts = response.data
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          // Handle
        }
      }
    },
    /***/
    async handleProductAssociation () {
      try {
        if (this.productToAssociate) {
          await this.$api.post('/images/associate', {
            product: this.productToAssociate.id,
            images: this.selectedImages
          })

          this.productToAssociate = null
          this.selectedImages = []

          this.notify({
            message: 'Products were correctly associated'
          })
        }
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          // Handle
        }
      }
    },
    /***/
    handleFilterProducts (value: string, update: (fn: () => void) => void, _abort: () => void) {
      console.log(value)
      update(() => {
        this.handleSearchProducts(value)
      })
    },
    /***/
    abortFilterProducts () {

    },
    /**
     * This function is used to search the database for
     * images by debouncing the requests
     */
    handleSearchImages: _.debounce(async function () {
      await this.requestImages()
    }, 1000),
    /***/
    // requestFilteredImages: _.debounce(async function () {
    //   try {
    //     const response = await this.$api.post('shop/filter-images', {
    //       image_filters: this.imageFilters
    //     })
    //     this.images = response.data
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }, 1000),
    /***/
    handleAddFilter (column: string) {
      this.imageFilters.push({
        column,
        operator: 'Equals',
        value: ''
      })
    },
    /***/
    handleRemoveFilter (index: number) {
      this.imageFilters.splice(index, 1)
    },
    /***/
    // handleInfinitePagination (index: number, done: () => void) {
    //   setTimeout(() => {
    //     this.requestDeferImages()
    //     done()
    //   }, 1000)
    // },
    /***/
    handleAddImage () {
      this.requestData.files.push({
        name: '',
        content: null
      })
    }
  }
})
</script>
