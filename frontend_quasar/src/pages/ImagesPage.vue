<template>
  <q-page padding>
    <div class="row">
      <!-- Header -->
      <header class="col-12">
        <q-card class="q-mb-md" flat>
          <q-card-section>
            <div class="flex justify-between align-center">
              <q-input style="width: 50%;" outlined @keypress="requestDeferImages">
                <template v-slot:prepend>
                  <q-icon name="fas fa-search"></q-icon>
                </template>
              </q-input>

              <q-btn color="black" unelevated>
                <q-icon name="fas fa-filter" size="1em" rounded></q-icon>

                <q-menu>
                  <q-list>
                    <q-item v-close-popup clickable @click="handleAddFilter">Column</q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </q-card-section>

          <!-- Filters -->
          <q-card-section v-if="imageFilters.length > 0">
            <q-btn v-for="(imageFilter, i) in imageFilters" :key="i" class="q-mr-sm" color="primary" unelevated rounded>
              Column: value <q-icon class="q-mr-sm" name="fas fa-caret-down" size="1em"></q-icon>

              <q-menu>
                <q-item>
                  <div class="flex justify-evenly align-center">
                    <q-select :options="['Equals']" class="q-pr-sm" use-input dense outlined></q-select>
                    <q-input class="q-pr-sm" dense outlined @keypress="requestDeferImages"></q-input>
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
        <q-infinite-scroll :offset="250" class="row" @load="handleInfinitePagination">
          <article v-for="(image, i) in images" :key="i" class="col-3 q-pa-sm">
            <q-card :aria-label="image">
              <router-link :to="{ name: 'image_view', params: { id: i } }">
                <q-img src="https://placehold.co/400x600"></q-img>
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
import { ref } from 'vue'

export default {
  setup () {
    const images = ref([])
    const imageFilters = ref([])
    return {
      imageFilters,
      images
    }
  },
  created () {
    for (let i = 0; i < 8; i++) {
      this.images.push({})
    }
  },
  methods: {
    async requestImages () {
      this.images.push({}, {}, {}, {}, {}, {}, {}, {})
    },
    requestDeferImages: _.debounce(async function () {
      await this.requestImages()
    }, 1000),
    handleAddFilter () {
      this.imageFilters.push({})
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
