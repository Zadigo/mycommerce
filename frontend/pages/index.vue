<template>
  <section id="collections" class="container-fluid section-margin-1 mb-5">
    <div class="row">
      <div class="col-sm-12 col-md-10 offset-md-1">
        <div v-if="isLoading" class="row g-1">
          <div v-for="i in 3" :key="i" class="col-sm-12 col-md-4 my-1">
            <!-- <BaseSkeleton :loading="true" height="400px" /> -->
            Loading...
          </div>
        </div>
        
        <div v-else class="row g-1">
          <BaseStaticCollectionCard name="All" view-name="all" image="/img4.jpeg" />
          <BaseCollectionCard v-for="collection in collections" :key="collection.id" :collection="collection" image="/img5.jpeg" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useStorageAsync } from '@vueuse/core'
import type { CollectionName } from '~/types'

const { gtag } = useGtag()

useHead({
  title: 'Achat en ligne de vêtements',
  meta: [
    {
      key: 'description',
      content: 'Découvrez notre collection de vêtements en ligne'
    }
  ]
})

// Composable for Collection Fetching
function useCollectionDetails () {
  const cachedCollections = useStorageAsync<CollectionName[]>('collections', [])
  
  const collections = ref<CollectionName[]>([])
  const isLoading = ref(true)
  
  const { $client } = useNuxtApp()
  const { handleError } = useErrorHandler()
  
  /**
   * Gets all the names of the collections that are
   * available to be displayed on this page
   */
  async function requestCollectionNames () {
    try {
      // FIXME: This does not catch the cached collections
      // on the client side -; using local storage raises
      // hydration error since the server side does not
      // know about the local storage
      if (cachedCollections.value.length > 0) {
        collections.value = cachedCollections.value
        isLoading.value = false
        return
      }

      const response = await $client.get<CollectionName[]>('collection') 

      // Validate data with Zod
      // const validatedCollections = response.data.map(collection => 
      //   CollectionSchema.parse(collection)
      // )

      // collections.value = validatedCollections
      // cachedCollections.value = validatedCollections

      collections.value = response.data
      cachedCollections.value = response.data

      isLoading.value = false
    } catch (e) {
      handleError(e)
    }
  }
  
  return {
    collections,
    isLoading,
    requestCollectionNames
  }
}

const { collections, isLoading, requestCollectionNames } = useCollectionDetails()

onBeforeMount(requestCollectionNames)
onMounted(() => {
  gtag('event', 'page_view', {
    screen_name: 'Achat en ligne de vêtements'
  })
})
</script>
