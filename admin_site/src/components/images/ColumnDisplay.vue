<template>
  <div class="row q-col-gutter-sm">
    <div v-for="image in images" :key="image.id" class="col-3">
      <q-card flat>
        <q-img :src="mediaPath(image.mid_size)">
          <div class="absolute-top text-h6">
            <q-checkbox v-model="selectedImages" :val="image.id" label="Teal" color="teal" @update:model-value="emit('select-image', selectedImages)" />
            {{ image.name }}
          </div>

          <div class="absolute-bottom bg-transparent justify-right">
            <q-btn color="primary" rounded>
              <q-icon name="add" />
            </q-btn>

            <q-btn :to="{ name: 'image_view', params: { id: image.id } }" color="primary" rounded>
              <q-icon name="link" />
            </q-btn>
          </div>
        </q-img>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ProductImage } from 'app/types'
import { useDjangoUtilies } from 'src/composables/utils'
import { PropType, ref } from 'vue'

defineProps({
  images: {
    type: Array as PropType<ProductImage[]>
  }
})

const emit = defineEmits({
  'select-image' (_items: ProductImage[]) {
    return true
  }
})

const { mediaPath } = useDjangoUtilies()
const selectedImages = ref<ProductImage[]>([])
</script>
