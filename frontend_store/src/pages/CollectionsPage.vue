<template>
  <shop-layout>
    <section id="collections" class="container-fluid space-section">
      <div class="row">
        <div class="col-sm-12 col-md-10 offset-md-1">
          <div class="row g-1">
            <article v-for="i in 6" :key="i" class="col-sm-12 col-md-4 my-1">
              <router-link :to="{ name: 'shop_products_collection', params: { id: 'all'} }">
                <article class="card shadow-none" aria-label="">
                  <img src="src/assets/img3.jpeg" alt="" class="card-img">
                  <!-- <v-img src="src/assets/img3.jpeg" lazy-src="src/assets/img3.jpeg" alt="" class="card-img"></v-img> -->
                  <h1 class="text-white text-center">Collection n° {{ i }}</h1>
                </article>
              </router-link>
            </article>
          </div>
        </div>
      </div>
    </section>
  </shop-layout>
</template>

<script>
import { ref } from 'vue'
import { useHead } from 'unhead'
// import { useCompany } from '@/composables/company';

export default {
  name: 'CollectionPage',
  setup () {
    useHead({
      title: 'Collections',
      description: '',
      meta: {

      }
    })

    const collections = ref([])
    
    return {
      collections
    }
  },
  created () {
    this.requestCollectionNames()
    // TODO: Analytics does not work
    // this.$analytics('event', 'page_view', {
    //   page_title: 'Soutien-Gorge',
    //   page_location: window.location.origin,
    //   page_path: this.$route.fullPath,
    // })
  },
  methods: {
    /**
     * Gets all the names of the collections that are
     * available to be displayed on this page
     * 
     * @listens
     */
    async requestCollectionNames () {
      try {
        const numberOfItems = this.$session.listCount('collections', false)

        if (numberOfItems === 0) {
          const response = await this.$http.get('collection')
          this.$session.create('collections', response.data)
        }

        this.collections = this.$session.retrieve('collections')
      } catch (e) {
        console.error('CollectionPage', e)
      }
    },
    /**
     * @param {Number} size The grid size
     */
    handleGridSize (size) {
      this.currentGridSize = size
    }
  }
}
</script>

<style scoped>
h1 {
  position: absolute;
  bottom: 3%;
  left: 0;
  width: 100%;
}
</style>
