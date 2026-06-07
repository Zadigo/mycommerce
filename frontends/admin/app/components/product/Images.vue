<template>
  <nuxt-card>
    <template #header>
      <h2>
        Images
      </h2>

      <nuxt-button v-if="currentProduct" @click="showModal = true">
        <icon name="i-lucide-upload" /> Upload
      </nuxt-button>
    </template>

    <div class="grid grid-cols-4 gap-2">
      <div v-for="image in images" :key="image.id" class="relative cursor-pointer">
        <img :src="image.mid_size" class="rounded-lg">

        <div class="absolute bottom-0 right-0 m-2">
          <nuxt-button color="primary" size="sm" :unelevated="true" @click="unlink(image)">
            <icon name="i-lucide-unlink" />
          </nuxt-button>
        </div>
      </div>
    </div>

    <!-- Images -->
    <template v-if="currentProduct">
      <div v-if="images.length > 0" class="flex justify-start">
        <div v-for="image in images" :key="image.id" class="col-3">
          <img :src="image.mid_size">
          <nuxt-button color="primary" size="sm" :unelevated="true" @click="unlink(image)">
            <icon name="i-lucide-unlink" />
          </nuxt-button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex justify-center">
        <nuxt-button @click="showModal = true">
          <icon name="i-lucide-upload" /> Add images
        </nuxt-button>
      </div>
    </template>
  </nuxt-card>

  <!-- Modals -->
  <nuxt-modal v-model:open="showModal">
    <template #title>
      <h2>
        Upload images
      </h2>
    </template>

    <template #body>
      <nuxt-input v-model="fileNames" placeholder="Files base name" />
      <nuxt-file-upload v-model="files" :multiple="true" label="Choose images to upload" />
    </template>

    <template #footer>
      <nuxt-button flat @click="showModal = false">
        Cancel
      </nuxt-button>

      <!-- data => currentProduct.images = data -->
      <nuxt-button v-if="currentProduct" color="primary" @click="() => { }">
        <icon name="i-lucide-upload" />
        Upload
      </nuxt-button>
      <nuxt-button v-else color="primary" @click="upload">
        <icon name="i-lucide-upload" />
        Upload
      </nuxt-button>
    </template>
  </nuxt-modal>
</template>

<script setup lang="ts">
import type { Product, ProductImage } from '~/types'

const showModal = ref(false)

const { currentProduct = undefined } = defineProps<{ currentProduct?: Product }>()

defineEmits<{
  'associate-images': [data: ProductImage[]]
  'update-images': [data: { product: Product; images: ProductImage[] }]
  'update:modelValue': [data: Product]
}>()


const { images, upload, fileNames, files  } = await useImagesComposable()
const { unlink } = useImageAssociation(images)

onBeforeMount(() => {
  if (isDefined(currentProduct)) {
    fileNames.value = currentProduct.name
  }
})
</script>
