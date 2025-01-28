<template>
  <q-card class="q-mb-sm">
    <q-card-section>
      <h2 class="text-h6 q-ma-none">
        Product images
      </h2>
    </q-card-section>

    <q-separator />

    <q-card-section v-if="currentProduct">
      <div v-if="currentProduct.images.length > 0" class="row q-gutter-sm flex justify-center">
        <div v-for="image in currentProduct.images" :key="image.id" class="col-3">
          <q-img :src="mediaPath(image.original)" width="100">
            <div class="absolute-bottom text-h6 flex justify-center">
              <q-btn color="primary" size="sm" :unelevated="true" @click="handleUnlinkImage(image)">
                <q-icon name="fa fa-unlink" />
              </q-btn>
            </div>
          </q-img>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-else>
      <div class="row q-gutter-sm flex justify-center">
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
        <q-form @submit.prevent>
          <q-input v-model="selectedFilesBaseName" :rules="[isNotNull]" placeholder="Files base name" class="q-mb-sm" outlined />
          <q-file v-model="selectedFiles" :multiple="true" outlined label="Choose images to upload" />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat @click="showUploadImagesDialog = false">
          Cancel
        </q-btn>

        <!-- data => currentProduct.images = data -->
        <q-btn color="primary" @click="uploadImagesToProduct(currentProduct, uploadCallback)">
          <q-spinner-cube v-if="isRunning" size="xs" color="white" class="q-mr-sm" />
          <q-icon name="upload" class="q-mr-sm" />
          Upload
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { AxiosError } from 'axios'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useDjangoUtilies, useImagesUpload } from 'src/composables/utils'
import { Product, ProductImage } from 'src/types'
import { inject, onBeforeMount, ref } from 'vue'

const { notify } = useQuasar()
const { mediaPath } = useDjangoUtilies()
const { selectedFiles, selectedFilesBaseName, uploadImagesToProduct, isRunning } = useImagesUpload()

const currentProduct = inject<Product>('currentProduct')
const showUploadImagesDialog = ref(false)

const emit = defineEmits({
  'update-product' (_data: Product) {
    return true
  },
  'update-images' (_data: { product: Product, images: ProductImage[] }) {
    return true
  },
  'update:modelValue' (_data) {
    return true
  }
})

onBeforeMount(() => {
  if (currentProduct) {
    selectedFilesBaseName.value = currentProduct.name
  }
})

async function handleUnlinkImage (image: ProductImage) {
  try {
    if (currentProduct) {
      const response = await api.patch<ProductImage[]>('admin/images/associate', {
        product: currentProduct.id,
        image: image.id,
        method: 'Dissociate'
      })
      currentProduct.images = response.data
      emit('update-images', {
        product: currentProduct,
        images: response.data
      })
    }
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // Handle
    }
  }
}

function isNotNull (value: string) {
  return value !== '' || 'Cannot be empty'
}

function uploadCallback (data: Product) {
  emit('update-product', data)
  notify({
    color: 'red-1',
    textColor: 'dark',
    closeBtn: true,
    position: 'bottom',
    message: 'Failed to save product'
  })
}
</script>
