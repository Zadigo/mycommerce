<template>
  <q-page padding>
    <div class="row">
      <!-- Header -->
      <header class="col-12">
        <q-card class="q-mb-md" flat>
          <q-card-section>
            <div class="flex justify-between align-center">
              <q-input v-model="searchedData.name" placeholder="Search images..." style="width: 50%;" outlined @keypress="requestDeferImages">
                <template v-slot:prepend>
                  <q-icon name="fas fa-search"></q-icon>
                </template>
              </q-input>

              <q-btn color="black" unelevated>
                <q-icon name="fas fa-filter" size="1em" rounded></q-icon>

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
          <q-card-section v-if="imageFilters.length > 0">
            <q-btn v-for="(imageFilter, i) in imageFilters" :key="i" class="q-mr-sm" color="primary" unelevated rounded>
              {{ imageFilter.operator }}: {{ imageFilter.value }} <q-icon class="q-ml-sm" name="fas fa-caret-down" size="1em"></q-icon>

              <q-menu>
                <q-item>
                  <div class="flex justify-evenly align-center">
                    <q-select v-model="imageFilter.operator" :options="['Equals']" class="q-pr-sm" use-input dense outlined></q-select>
                    <q-input v-model="imageFilter.value" class="q-pr-sm" dense outlined @keypress="requestFilteredImages"></q-input>
                    <q-btn class="text-black" color="grey-1" unelevated @click="handleRemoveFilter(i)">
                      <q-icon name="fas fa-trash" size="1em"></q-icon>
                    </q-btn>
                  </div>
                </q-item>
              </q-menu>
            </q-btn>
          </q-card-section>
        </q-card>
      </header>

      <div class="col-12">
        <q-btn @click="showUploadImagesDialog = true">
          Upload images
        </q-btn>

        <q-btn :disable="!enableProductAssociationButton" @click="showProductAssociationDialog = true">
          Associate images
        </q-btn>
      </div>

      <!-- Images -->
      <div class="col-12">
        <div class="row q-col-gutter-sm">
          <div v-for="image in images" :key="image.id" class="col-3">
            <q-card flat>
              <q-img :src="djangoMediaUrl(image.mid_size)">
                <div class="absolute-top text-h6">
                  <q-checkbox v-model="selectedImages" :val="image.id" label="Teal" color="teal" />
                  {{ image.name }}
                </div>

                <div class="absolute-bottom bg-transparent justify-right">
                  <q-btn color="primary" rounded>
                    <q-icon name="add"></q-icon>
                  </q-btn>

                  <q-btn :to="{ name: 'image_view', params: { id: image.id } }" color="primary" rounded>
                    <q-icon name="link"></q-icon>
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
            <q-form @submit.prevent>
              <div v-for="(file, i) in requestData.files" :key="i" class="flex justify-start align-center q-gutter-sm q-mb-sm">
                <q-file v-model="file.content" label="Select file" outlined />
                <q-input v-model="file.name" placeholder="File name" outlined></q-input>
                <q-btn color="secondary" variant="text" @click="handleAddImage"><q-icon name="add"></q-icon></q-btn>
              </div>
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat @click="showUploadImagesDialog = false">
              Cancel
            </q-btn>

            <q-btn flat @click="handleUploadImages">
              Upload
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showProductAssociationDialog">
        <q-card>
          <q-card-section>
            <q-select v-model="productToAssociate" :options="searchedProducts" option-label="name" option-value="id" filled use-input hide-selected fill-input input-debounce="0" label="Select a product" @filter="handleFilterProducts" @filter-abort="abortFilterProducts">
              <template v-slot:no-option>
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
</template>

<script>
import _ from 'lodash'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useShop } from 'src/stores/shop'
import { whenever } from '@vueuse/core'
import { useMedia } from 'src/composables/media'
import { useQuasar } from 'quasar'

export default {
  name: 'ImagesPage',
  setup () {
    const { notify } = useQuasar()
    const store = useShop()
    const { images } = storeToRefs(store)

    const searchedData = ref({
      name: null
    })
    const imageFilters = ref([])
    const filteringColumns = [
      'Name'
    ]

    const showUploadImagesDialog = ref(false)

    const requestData = ref({
      files: [
        {
          name: null,
          content: null
        }
      ]
    })

    const selectedImages = ref([])
    const enableProductAssociationButton = ref(false)
    const showProductAssociationDialog = ref(false)
    const searchedProducts = ref([])
    const productToAssociate = ref(null)

    const { djangoMediaUrl } = useMedia()

    whenever(selectedImages, (items) => {
      if (items.length > 0) {
        enableProductAssociationButton.value = true
      } else {
        enableProductAssociationButton.value = false
      }
    })

    return {
      notify,
      searchedProducts,
      productToAssociate,
      enableProductAssociationButton,
      showProductAssociationDialog,
      selectedImages,
      djangoMediaUrl,
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
    async handleUploadImages () {
      try {
        const formData = new FormData()

        this.requestData.files.forEach(file => {
          formData.append('files', file.content, file.name)
          formData.append('name', file.name)
        })

        const response = await this.$api.post('shop/images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.images = response.data
        this.requestData.files = [{
          name: null,
          content: null
        }]
      } catch (e) {
        console.log(e)
      }
    },
    async requestImages () {
      try {
        const response = await this.$api.get('shop/images', {
          params: this.searchedData
        })
        this.images = response.data
      } catch (e) {
        console.log(e)
      }
    },
    async handleSearchProducts (search) {
      try {
        const response = await this.$api.get('shop/search', {
          params: {
            q: search
          }
        })
        this.searchedProducts = response.data
      } catch (e) {
        console.log(e)
      }
    },
    async handleProductAssociation () {
      try {
        await this.$api.post('shop/images/associate', {
          product: this.productToAssociate.id,
          images: this.selectedImages
        })
        
        this.productToAssociate = {}
        this.selectedImages = []

        this.notify({
          message: 'Products were correctly associated'
        })
      } catch (e) {
        console.log(e)
      }
    },
    handleFilterProducts (val, update, abort) {
      update(() => {
        this.handleSearchProducts(val)
      })
    },
    abortFilterProducts () {

    },
    requestDeferImages: _.debounce(async function () {
      await this.requestImages()
    }, 1000),
    requestFilteredImages: _.debounce(async function () {
      try {
        const response = await this.$api.post('shop/filter-images', {
          image_filters: this.imageFilters
        })
        this.images = response.data
      } catch (e) {
        console.log(e)
      }
    }, 1000),
    handleAddFilter (column) {
      this.imageFilters.push({
        column,
        operator: 'Equals',
        value: null
      })
    },
    handleRemoveFilter (index) {
      this.imageFilters.splice(index, 1)
    },
    handleInfinitePagination (index, done) {
      setTimeout(() => {
        this.requestDeferImages()
        done()
      }, 1000)
    },
    handleAddImage () {
      this.requestData.files.push({
        name: null, 
        content: null
      })
    }
  }
}
</script>
