<template>
  <nuxt-container>
    <nuxt-card>
      <template #header>
        <nuxt-input v-model="search" />
        <nuxt-button @click="() => { toggle() }">
          <icon name="i-lucide-file" />
        </nuxt-button>
        <nuxt-button to="/dashboard/products/create" color="primary">
          <icon name="i-lucide-plus" /> New product
        </nuxt-button>
      </template>

      <nuxt-table :data="productsForTable" :columns="tableColumns" loading-color="primary" loading-animation="carousel" class="flex-1" sticky />
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
const { products, tableColumns, convertForTable } = useProducts()
const { search, searched } = useProductSearch(products)
const productsForTable = convertForTable(searched)
const { upload, file, showModal, toggle } = useProductsUpload(products)

</script>
