<template>
  <shop-layout>
    <section id="collections" class="container-fluid section-margin">
      <div class="row">
        <div class="col-sm-12 col-md-10 offset-md-1">
          <div class="row g-1">
            <article v-for="i in 6" :key="i" class="col-sm-12 col-md-4 my-1">
              <router-link :to="{ name: 'shop_products_collection', params: { id: 'all'} }">
                <article :aria-label="`Collection n°${i}`" class="card shadow-none">
                  <img :alt="`Collection n°${i}`" src="/img4.jpeg" class="card-img">
                  
                  <h1 class="text-white text-left h3 fw-bold text-uppercase px-2 py-4">
                    Collection n° {{ i }}
                  </h1>
                </article>
              </router-link>
            </article>
          </div>
        </div>
      </div>
    </section>
  </shop-layout>
</template>

<script lang="ts">
import { CollectionName } from '@/types/collections';
import { useHead } from 'unhead';
import { defineComponent, ref } from 'vue';

import ShopLayout from '@/layouts/ShopLayout.vue';

export default defineComponent({
  name: 'CollectionsPage',
  components: {
    ShopLayout
  },
  setup () {
    useHead({
      title: 'Collections'
    })

    const collections = ref<CollectionName[]>([])

    return {
      collections
    }
  },
  created () {
    this.requestCollectionNames()
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
          const response = await this.$http.get<CollectionName>('collection')
          this.$session.create('collections', response.data)
        }

        this.collections = this.$session.retrieve<CollectionName[]>('collections')
      } catch (e) {
        console.error('CollectionPage', e)
      }
    },
    /**
     * @param {Number} size The grid size
     */
    handleGridSize (size: string) {
      this.currentGridSize = size
    }
  }
})
</script>

<style scoped>
h1 {
  position: absolute;
  bottom: 3%;
  left: 0;
  width: 100%;
}
</style>
