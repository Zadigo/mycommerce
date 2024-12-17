<template>
  <q-page padding>
    <div class="row">
      <div class="col-10 offset-1">
        <div class="row">
          <div class="col-6 q-pr-sm">
            <q-card>
              <!-- <q-img src="https://placehold.co/400x600"></q-img> -->
              <q-img :src="`http://127.0.0.1:8000${store.currentImage.mid_size}`"></q-img>
            </q-card>
          </div>

          <div class="col-6">
            <q-card class="q-mb-sm">
              <q-card-section>
                <q-input v-model="store.currentImage.name" class="q-mb-sm" outlined></q-input>
                <q-select v-model="searchedData.name" :options="searchedProducts" label="Product name" outlined use-input @filter="filterSelection" @filter-abort="abortFilterFn"></q-select>
                <q-btn color="secondary" class="q-mt-sm" unelevated rounded @click="showProductModal = true">
                  <q-icon class="q-mr-sm" size="1em" name="fas fa-arrow-up-right-from-square"></q-icon>
                  Product
                </q-btn>
              </q-card-section>
            </q-card>

            <q-card>
              <q-card-section>
                <q-btn color="primary" style="width: 100%;" unelevated rounded>
                  <q-icon class="q-mr-sm" name="fas fa-save" size="1em"></q-icon>
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

            <!-- <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
              <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
            </q-btn>
            <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
              <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
            </q-btn> -->

            <q-btn v-close-popup dense flat icon="close">
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <div class="row">
              <div class="col-10 offset-1">
                <div class="row">
                  <div class="col-6 q-pr-md">
                    <q-card flat>
                      <q-img src="https://placehold.co/400x600"></q-img>
                    </q-card>
                  </div>

                  <div class="col-6">
                    <h1 class="text-h6 text-weight-light q-mb-sm">Product name that is just that</h1>
                    <q-badge class="q-mb-xl" color="green-1">Active</q-badge>

                    <div class="flex justify-left">
                      <q-badge color="green-4" class="text-weight-bolder text-h3 q-mr-md">34€</q-badge>
                      <q-badge color="red-4" class="text-weight-bolder text-h3">45€</q-badge>
                    </div>

                    <p class="q-my">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat
                      ipsum nihil ullam perspiciatis accusantium harum soluta repudiandae quam
                      numquam, quod repellendus corporis sapiente, provident eum. A aspernatur sunt at incidunt.
                    </p>

                    <q-btn :to="{ name: 'product_view', params: { id: 1 }, query: { r: true } }">Modify</q-btn>
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

<script>
import _ from 'lodash'
import { useShop } from 'src/stores/shop';
import { ref } from 'vue';

export default {
  name: 'ImagePage',
  setup () {
    const store = useShop()
    const showProductModal = ref(false)
    const maximizedToggle = ref(true)
    const searchedProducts = ref([])
    const searchedData = ref({
      name: null
    })
    return {
      store,
      searchedData,
      searchedProducts,
      maximizedToggle,
      showProductModal
    }
  },
  created () {
    this.store.setCurrentImage(this.$route.params.id)
  },
  methods: {
    filterSelection (val, update, abort) {
      if (this.searchedProducts.value !== null) {
        update()
        return
      }

      update(() => {
        this.requestProducts()
      })
      // setTimeout(() => {
      // }, 2000)
    },
    abortFilterFn () {
      // console.log('delayed filter aborted')
    },
    async requestProducts () {
      try {
        const response = await this.$api.get('shop/products', {
          params: this.searchedData
        })
        this.searchedProducts = response.data
      } catch (e) {
        console.log(e)
      }
    }
    // requestProducts: _.debounce(async function () {
    //   try {
    //     const response = await this.$api.get('shop/products', {
    //       params: this.searchedData
    //     })
    //     this.searchedProducts = response.data
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }, 1000)
  }
}
</script>
