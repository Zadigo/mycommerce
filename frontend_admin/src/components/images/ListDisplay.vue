<template>
  <q-list bordered separator>
    <q-item v-for="image in images" :key="image.id" clickable v-ripple>
      <q-item-section>
        <img :src="mediaPath(image.thumbnail)" width="100" />
      </q-item-section>

      <q-item-section>
        {{ image.name }}
      </q-item-section>
    </q-item>
  </q-list>
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
