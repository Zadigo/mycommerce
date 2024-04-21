<template>
  <shop-layout>
    <section id="collection" class="container-fluid my-5">
      <div class="row">
        <div class="col-sm-12 col-md-10 offset-md-1">
          <div class="row g-1">
            <div v-for="i in 6" :key="i" class="col-sm-12 col-md-4 my-1">
              <router-link :to="{ name: 'shop_products_collection', params: { id: 'my-collection'} }">
                <article class="card shadow-none" aria-label="">
                  <img src="../../assets/img3.jpeg" alt="" class="card-img">
                  <h1 class="text-white text-center">Collection name</h1>
                </article>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </shop-layout>
</template>

<script>
import { useHead } from 'unhead'
import { ref } from 'vue'

export default {
  name: 'CollectionPage',
  setup () {
    useHead({
      title: 'Soutien-gorge'
    })
    const collections = ref([])
    return {
      collections
    }
  },
  mounted () {
    this.requestCollectionNames()
    // TODO: Analytics does not work
    this.$analytics('event', 'page_view', {
      page_title: 'Soutien-Gorge',
      page_location: window.location.origin,
      page_path: this.$route.fullPath,
    })
  },
  methods: {
    async requestCollectionNames () {
      try {
        const numberOfItems = this.$session.listCount('collections')

        if (numberOfItems === 0) {
          const response = await this.$http.get('collection')
          this.$session.create('collections', response.data)
        }

        this.collections = this.$session.retrieve('collections')
      } catch (e) {
        console.error('CollectionPage', e)
      }
    },
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
