<template>
  <nuxt-container>
    <div class="row">
      <!-- Header -->
      <header>
        <nuxt-card>
          <div class="flex justify-between align-center">
            <nuxt-input v-model="search" type="search" class="w-full" option-label="name" option-value="id" placeholder="Select a product to use..." />
          </div>
        </nuxt-card>

        <nuxt-card>
          <nuxt-button @click="() => { toggleUploadModal() }">
            Upload images
          </nuxt-button>

          <nuxt-button @click="() => { toggleImageAssociation() }">
            Associate images
            <nuxt-badge :label="numberOfSelectedImages" variant="soft" />
          </nuxt-button>

          <nuxt-button>
            <icon name="i-lucide-table" />
          </nuxt-button>
        </nuxt-card>
      </header>

      <!-- Images -->
      <div class="grid grid-cols-2 gap-1 my-10 md:grid-cols-4">
        <images-column v-for="image in images" :key="image.id" :image="image" @select="select" />
      </div>
    </div>

    <!-- Modals -->
    <nuxt-modal v-model:open="uploadModal">
      <template #header>
        <h2>Upload images</h2>
      </template>

      <template #body>
        <nuxt-input v-model="fileNames" placeholder="File names" />
        <nuxt-file-upload v-model="files" :multiple="true" label="Select files" />
      </template>

      <template #footer>
        <nuxt-button @click="() => { toggleUploadModal() }">
          Cancel
        </nuxt-button>

        <!-- :loading="isUploading" -->
        <nuxt-button :loading="false" loading-icon="i-lucide-loader" @click="upload">
          Upload
        </nuxt-button>
      </template>
    </nuxt-modal>

    <nuxt-modal v-model:open="imageAssociationModal">
      <template #header>
        <h2>
          Select a product
        </h2>
      </template>

      <template #body>
        <nuxt-input-menu v-model="productToAssociate" :items="searchedProducts" label-key="name" value-key="id" open-on-focus />
      </template>

      <template #footer>
        <nuxt-button @click="() => { toggleImageAssociation() }">
          Cancel
        </nuxt-button>

        <nuxt-button @click="associate">
          Associate ({{ selectedImages.length }}) images
        </nuxt-button>
      </template>
    </nuxt-modal>
  </nuxt-container>
</template>

<script setup lang="ts">
import type { Product, ProductImage } from '~/types';

const { search, searched } = await useApiSearchEndpoint<ProductImage[]>('/admin/v1/images')
const { search: searchProducts, searched: searchedProducts } = await useApiSearchEndpoint<Product[]>('/admin/v1/products')
const { images, files, fileNames, select, showModal: uploadModal, toggle: toggleUploadModal, upload, numberOfSelectedImages } = await useImagesComposable()
const { productToAssociate, selectedImages, showModal: imageAssociationModal, associate, toggle: toggleImageAssociation } = useImageAssociation(images)
</script>
