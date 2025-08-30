<template>
  <nuxt-container>
    <nuxt-card>
      <template #header>
        {{ products[-1] }}
        <nuxt-input v-model="search" />
        <nuxt-button @click="() => { toggle() }">
          <icon name="i-lucide-file" />
        </nuxt-button>
      </template>

      <nuxt-table :data="searched" :columns="tableColumns" loading-color="primary" loading-animation="carousel" class="flex-1" sticky />
    </nuxt-card>

    <!-- Modals -->
    <nuxt-modal v-model:open="showModal">
      <template #header>
        <h2>Upload a file</h2>
      </template>

      <template #body>
        <nuxt-file-upload v-model="file" outlined label="Outlined" accept=".json, .csv" />
      </template>

      <template #footer>
        <nuxt-button @click="() => { toggle() }">
          Cancel
        </nuxt-button>

        <nuxt-button @click="() => { upload() }">
          Upload
        </nuxt-button>
      </template>
    </nuxt-modal>
  </nuxt-container>
</template>

<script setup lang="ts">
/**
 * Products
 */
const { products, tableColumns, fetch } = useProducts()
const { search, searched } = useProductSearch(products)
const { upload, file, showModal, toggle } = useProductsUpload(products)

onMounted(async () => await fetch())
</script>
