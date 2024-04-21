<template>
  <q-page padding>
    <div class="row">
      <!-- Header -->
      <header class="col-12">
        <q-card class="q-mb-md" flat>
          <q-card-section>
            <div class="flex justify-between align-center">
              <q-input v-model="searchedData.name" style="width: 50%;" outlined @keypress="requestDeferImages">
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
      
      <!-- Images -->
      <div class="col-12">
        <q-infinite-scroll :offset="1" class="row" @load="() => {}">
          <article v-for="(image, i) in images" :key="i" class="col-3 q-pa-sm">
            <q-card :aria-label="image">
              <router-link :to="{ name: 'image_view', params: { id: image.id } }">
                <!-- <q-img src="https://placehold.co/400x600"></q-img> -->
                <q-img :src="`http://127.0.0.1:8000/${image.mid_size}`"></q-img>
              </router-link>
            </q-card>
          </article>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </div>
  </q-page>
</template>

<script>
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { useShop } from 'src/stores/shop'
import { ref } from 'vue'

export default {
  name: 'ImagesPage',
  setup () {
    const store = useShop()
    const { images } = storeToRefs(store)
    // const images = ref([])
    const searchedData = ref({
      name: null
    })
    const imageFilters = ref([])
    const filteringColumns = [
      'Name'
    ]
    return {
      filteringColumns,
      searchedData,
      imageFilters,
      images
    }
  },
  created () {
    // this.requestImages()

    // for (let i = 0; i < 8; i++) {
    //   this.images.push({})
    // }
  },
  methods: {
    async requestImages () {
      // this.images.push({}, {}, {}, {}, {}, {}, {}, {})
      try {
        const response = await this.$api.get('shop/images', {
          params: this.searchedData
        })
        // this.images.push(response.data)
        this.images = response.data
        this.images.push({ id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }, { id: 1 })
      } catch (e) {
        console.log(e)
      }
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
    }
  }
}
</script>
