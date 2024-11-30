<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <q-btn :to="{ name: 'images_view' }">
              <q-icon name="fas fa-arrow-left" class="q-mr-sm" /> Back
            </q-btn>

            <q-btn @click="handlePagination('Previous')">
              <q-icon name="fas fa-arrow-left" />
            </q-btn>

            <q-btn @click="handlePagination('Next')">
              <q-icon name="fas fa-arrow-right" />
            </q-btn>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <div class="row">
          <div class="col-6 q-pr-sm">
            <q-card>
              <q-img v-if="store.currentImage" :src="mediaPath(store.currentImage.mid_size)" />
            </q-card>
          </div>

          <div class="col-6">
            <q-card v-if="store.currentImage" class="q-mb-sm">
              <q-card-section>
                <q-input v-model="store.currentImage.name" class="q-mb-sm" outlined />
                <q-select v-model="searchedData.name" :options="searchedProducts" label="Product name" outlined use-input @filter="filterSelection" @filter-abort="abortFilterFn" />
                <q-btn color="secondary" class="q-mt-sm" unelevated rounded @click="showProductModal = true">
                  <q-icon class="q-mr-sm" size="1em" name="fas fa-arrow-up-right-from-square" />
                  Product
                </q-btn>
              </q-card-section>
            </q-card>

            <q-card>
              <q-card-section>
                <q-btn color="primary" style="width: 100%;" unelevated rounded>
                  <q-icon class="q-mr-sm" name="fas fa-save" size="1em" />
                  Save
                </q-btn>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <q-dialog v-model="showProductModal" persistent :maximized="maximizedToggle" transition-show="slide-up" transition-hide="slide-down">
        <q-card class="bg-light text-black">
          <q-bar>
            <q-space />

            <q-btn v-close-popup dense flat icon="close">
              <q-tooltip class="bg-white text-primary">
                Close
              </q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <div class="row">
              <div class="col-10 offset-1">
                <div class="row">
                  <div class="col-6 q-pr-md">
                    <q-card flat>
                      <q-img src="https://placehold.co/400x600" />
                    </q-card>
                  </div>

                  <div class="col-6">
                    <h1 class="text-h6 text-weight-light q-mb-sm">
                      Product name that is just that
                    </h1>

                    <q-badge class="q-mb-xl" color="green-1">
                      Active
                    </q-badge>

                    <div class="flex justify-left">
                      <q-badge color="green-4" class="text-weight-bolder text-h3 q-mr-md">
                        34€
                      </q-badge>

                      <q-badge color="red-4" class="text-weight-bolder text-h3">
                        45€
                      </q-badge>
                    </div>

                    <p class="q-my">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat
                      ipsum nihil ullam perspiciatis accusantium harum soluta repudiandae quam
                      numquam, quod repellendus corporis sapiente, provident eum. A aspernatur sunt at incidunt.
                    </p>

                    <q-btn :to="{ name: 'product_view', params: { id: 1 }, query: { r: true } }">
                      Modify
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useSessionStorage } from '@vueuse/core'
import { Product } from 'app/types'
import { AxiosError } from 'axios'
import { useDjangoUtilies } from 'src/composables/utils'
import { useShop } from 'src/stores/shop'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ImagePage',
  setup () {
    const store = useShop()
    const { mediaPath } = useDjangoUtilies()
    
    const showProductModal = ref(false)
    const maximizedToggle = ref(true)
    const searchedProducts = ref<Product[]>([])
    const searchedData = ref({
      name: null
    })
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
      store,
      cachedImages,
      mediaPath,
      searchedData,
      searchedProducts,
      maximizedToggle,
      showProductModal
    }
  },
  created () {
    this.setMainImage()
  },
  watch: {
    '$route.params.id' (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.setMainImage()
      }
    }
  },
  methods: {
    setMainImage () {
      const imageId = parseInt(this.$route.params.id)
      this.store.images = this.cachedImages
      this.store.currentImage = this.store.images.find(x => x.id === imageId)
    },
    /**
     * TODO: 
     */
    filterSelection (value: string, update: (fn: () => void) => void, _abort: () => void) {
      if (this.searchedProducts !== null) {
        update()
        return
      }

      update(() => {
        this.requestProducts()
      })
    },
    /***/
    abortFilterFn () {
      // console.log('delayed filter aborted')
    },
    /***/
    async requestProducts () {
      try {
        const response = await this.$api.get<Product[]>('shop/products', {
          params: this.searchedData
        })
        this.searchedProducts = response.data
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          // Handle
        }
      }
    },
    /***/
    handlePagination (direction: 'Previous' | 'Next') {
      if (this.store.currentImage) {
        const currentIndex = this.store.images.findIndex(x => x.id === this.store.currentImage.id)
        const limit = this.store.images.length
        let result = 0

        if (direction === 'Previous') {
          result = currentIndex - 1
          if (result < 0) {
            result = 0
          }
        } else if (direction === 'Next') {
          result = currentIndex + 1
          
          if (result > limit) {
            result = 0
          }
        }

        const currentImage = this.store.images[result]
        this.$router.push({ name: 'image_view', params: { id: currentImage.id }})
      }
    }
  }
})
</script>
