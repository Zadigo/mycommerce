<template>
  <section id="collections" class="section-margin-2">
    <div class="row">
      <div class="col-sm-12 col-md-10 offset-md-1">
        <h1 class="mb-5">
          {{ $t("Nos collections") }}
        </h1>
      </div>

      <div class="col-sm-12 col-md-10 offset-md-1">
        <div class="row g-1">
          <article class="col-sm-12 col-md-4 my-1">
            <NuxtLink to="/shop/collection/all">
              <article aria-label="Toute la collection" class="card shadow-none">
                <NuxtImg alt="Toute la collection" src="/img5.jpeg" class="card-img" />
                
                <h1 class="text-white text-left h3 fw-bold text-uppercase px-2 py-4">
                  Toute notre collection
                </h1>
              </article>
            </NuxtLink>
          </article>

          <article v-for="collection in collections" :key="collection.id" class="col-sm-12 col-md-4 my-1">
            <NuxtLink :to="`/shop/collection/${collection.get_view_name}`">
              <article :aria-label="collection.name" class="card shadow-none">
                <NuxtImg :alt="collection.name" src="/img5.jpeg" class="card-img" />
                
                <h1 class="text-white text-left h3 fw-bold text-uppercase px-2 py-4">
                  {{ collection.name }}
                </h1>
              </article>
            </NuxtLink>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useStorageAsync } from '@vueuse/core';
import { AxiosError } from 'axios';
import type { CollectionName } from '~/types';

console.info('index.vue', window)
const storageConnection = createConnection('e-commerce')
const storage = useIDBStorage(storageConnection)
const { $client } = useNuxtApp()

useHead({
  title: 'Achat en ligne de vêtements',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

const collections = ref<CollectionName[]>([])

/**
 * Gets all the names of the collections that are
 * available to be displayed on this page
 */
async function requestCollectionNames () {
  try {
    const result = useStorageAsync('collection', collections, storage, {
      onError: (e) => {
        console.log('useStorageAsync', e)
      }
    })

    if (result.value.length === 0) {
      const response = await $client.get<CollectionName[]>('collection')
      collections.value = response.data
    }
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // Handle error
    }
  }
}

onBeforeMount(async () => {
  await requestCollectionNames()
})
</script>

<style lang="scss" scoped>
article {
  h1 {
    position: absolute;
    bottom: 3%;
    left: 0;
    width: 100%;
  }
}
</style>
