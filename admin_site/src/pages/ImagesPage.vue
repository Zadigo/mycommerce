<template>
  <q-layout view="lHh Lpr lFf" class="bg-white">
    <q-page padding>
      <div class="row">
        <!-- Header -->
        <header class="col-12">
          <q-card class="q-mb-md" flat>
            <q-card-section>
              <div class="flex justify-between align-center">
                <q-input v-model="searchedData.name" placeholder="Search images..." style="width: 50%;" outlined @keypress="handleSearchImages">
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
            </q-card-section>
          </q-card>
        </header>

        <!-- Images -->
        <div class="col-12">
          <div class="row q-col-gutter-sm">
            <div v-for="image in images" :key="image.id" class="col-3">
              <q-card flat>
                <q-img :src="mediaPath(image.mid_size)">
                  <div class="absolute-top text-h6">
                    <q-checkbox v-model="selectedImages" :val="image.id" label="Teal" color="teal" />
                    {{ image.name }}
                  </div>

                  <div class="absolute-bottom bg-transparent justify-right">
                    <q-btn color="primary" rounded>
                      <q-icon name="add" />
                    </q-btn>

                    <q-btn :to="{ name: 'image_view', params: { id: image.id } }" color="primary" rounded>
                      <q-icon name="link" />
                    </q-btn>
                  </div>
                </q-img>
              </q-card>
            </div>
          </div>

          <!-- <q-infinite-scroll :offset="1" class="row" @load="() => {}">
            <article v-for="(image, i) in images" :key="i" class="col-3 q-pa-sm">
              <q-card :aria-label="image">
                <router-link :to="{ name: 'image_view', params: { id: image.id } }">
                  <q-img src="https://placehold.co/400x600"></q-img>
                  <q-img :src="`http://127.0.0.1:8000${image.mid_size}`"></q-img>
                </router-link>
              </q-card>
            </article>

            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll> -->
        </div>

        <!-- Modals -->
        <q-dialog v-model="showUploadImagesDialog">
          <q-card style="width:700px;">
            <q-card-section>
              <h2 class="text-h5 q-ma-none">Upload images</h2>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <!-- <q-form @submit.prevent>
                <div v-for="(file, i) in requestData.files" :key="i" class="flex justify-start align-center q-gutter-sm q-mb-sm">
                  <q-file v-model="file.content" label="Select file" outlined />
                  <q-input v-model="file.name" placeholder="File name" outlined></q-input>
                  <q-btn color="secondary" variant="text" @click="handleAddImage"><q-icon name="add" /></q-btn>
                </div>
              </q-form> -->

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
import { Product, ProductImage } from 'app/types'
import { AxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useDjangoUtilies } from 'src/composables/utils'
import { useShop } from 'src/stores/shop'
import { defineComponent, ref } from 'vue'

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

    whenever(selectedFiles, (items) => {
      console.log('whenever', items)
    })

    const selectedImages = ref<ProductImage[]>([])
    const enableProductAssociationButton = ref(false)
    const showProductAssociationDialog = ref(false)
    const searchedProducts = ref<Product[]>([])
    const productToAssociate = ref<Product | null>(null)

    whenever(selectedImages, (items) => {
      if (items.length > 0) {
        enableProductAssociationButton.value = true
      } else {
        enableProductAssociationButton.value = false
      }
    })

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

    return {
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

        const response = await this.$api.post('shop/admin/images/upload', formData, {
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
        const response = await this.$api.get<ProductImage[]>('shop/admin/images', {
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
        const response = await this.$api.get<Product[]>('shop/admin/products', {
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
          await this.$api.post('shop/admin/images/associate', {
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
