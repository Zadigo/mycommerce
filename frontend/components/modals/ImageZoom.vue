<template>
  <TailSheet id="image-zoom" v-model:open="show">
    <TailSheetContent side="bottom" class="relative">
      <div class="px-20">
        <div v-if="image" :style="`background-image: url('${image.original}');`" class="zoomed-image" @click="show=false" />

        <div v-if="product && image" id="image-choices" class="flex flex-column gap-3">
          <NuxtImg v-for="otherImage in product.images" :key="otherImage.id" :class="{ 'selected': otherImage.id === image.id }" :src="otherImage.thumbnail" width="100px" @click="handleSelectedImage(image)" />
        </div>
      </div>
    </TailSheetContent>
  </TailSheet>
</template>

<script setup lang="ts">
import type { Product, ProductImage } from '~/types'

const props = defineProps<{
  modelValue: boolean
  product: Product | null | undefined
  image: ProductImage | null | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'select-image': [image: ProductImage]
}>()

const { handleSelectedImage } = useImages()
const show = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: false
})
</script>

<style lang="scss" scoped>
.zoomed-image {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 1000px;
  min-height: 1300px;
  cursor: zoom-out;
}

#image-choices {
  position: absolute;
  top: 10%;
  right: 3%;

  .selected {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  img {
    cursor: pointer;
  }
}
</style>
