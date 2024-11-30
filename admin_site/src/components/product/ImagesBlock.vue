<template>
  <q-card class="q-mb-sm">
    <q-card-section>
      <h2 class="text-h6 q-ma-none">
        Product images
      </h2>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div v-if="currentProduct" class="row q-gutter-sm flex justify-center">
        <div v-for="image in currentProduct.images" :key="image.id" class="col-3">
          <q-img :src="mediaPath(image.original)" width="100">
            <div class="absolute-bottom text-h6">
              <q-btn color="primary" size="sm">
                <q-icon name="delete" />
              </q-btn>
            </div>
          </q-img>
        </div>
      </div>

      <div v-else class="row q-gutter-sm flex justify-center">
        <q-btn class="q-my-md" color="primary" size="xl" rounded @click="showUploadImagesDialog = true">
          <q-icon name="upload" class="q-mr-sm" /> Add images
        </q-btn>
      </div>
    </q-card-section>
  </q-card>

  <!-- Modals -->
  <q-dialog v-model="showUploadImagesDialog">
    <q-card style="width: 600px;">
      <q-card-section>
        <h2 class="text-h6 q-ma-none">
          Upload images
        </h2>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input v-model="selectedFilesBaseName" class="q-mb-sm" outlined />
        <q-file v-model="selectedFiles" :multiple="true" outlined label="Outlined" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat @click="showUploadImagesDialog = false">
          Cancel
        </q-btn>

        <!-- data => currentProduct.images = data -->
        <q-btn color="primary" @click="uploadImagesToProduct(currentProduct, () => {})">
          <q-spinner-cube size="xs" color="white" class="q-mr-sm" />
          <q-icon name="upload" class="q-mr-sm" />
          Upload
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { Product } from 'app/types'
import { useDjangoUtilies, useImagesUpload } from 'src/composables/utils'
import { inject, ref } from 'vue'

const { mediaPath } = useDjangoUtilies()
const { selectedFiles, selectedFilesBaseName, uploadImagesToProduct } = useImagesUpload()

const currentProduct = inject<Product>('currentProduct')
const showUploadImagesDialog = ref(false)
</script>
