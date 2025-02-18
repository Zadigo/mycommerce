<template>
  <section id="collections" class="container-fluid section-margin-1 mb-5">
    <div class="row">
      <div class="col-sm-12 col-md-10 offset-md-1">
        <div v-if="status === 'pending'" class="row g-1">
          <div v-for="i in 3" :key="i" class="col-sm-12 col-md-4 my-1">
            <BaseSkeleton :loading="true" height="400px" />
          </div>
        </div>
        
        <div v-else class="row g-1">
          <BaseStaticCollectionCard name="All" view-name="all" image="/img4.jpeg" />
          <BaseCollectionCard v-for="collection in cachedCollections" :key="collection.id" :collection="collection" image="/img5.jpeg" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CollectionName } from '~/types'

const cachedCollections = useLocalStorage<CollectionName[]>('collections', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const { handleError } = useErrorHandler()
// const { gtag } = useGtag()

useHead({
  title: 'Achat en ligne de vêtements',
  meta: [
    {
      key: 'description',
      content: 'Découvrez notre collection de vêtements en ligne'
    }
  ]
})

useSchemaOrg({

})

const { data, status } = await useFetch('/api/collections/all', {
  onResponseError({ error }) {
    handleError(error?.message)
  }
})

cachedCollections.value = data.value

onMounted(() => {
  // gtag('event', 'page_view', {
  //   screen_name: 'Achat en ligne de vêtements'
  // })
})
</script>
