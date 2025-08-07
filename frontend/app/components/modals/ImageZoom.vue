<template>
  <TailSheet id="image-zoom" v-model:open="show">
    <TailSheetContent aria-describedby="Product image details" class="max-h-[600px]" side="bottom">
      <TailSheetTitle>
        Product
      </TailSheetTitle>

      <div class="px-20 my-2 relative overflow-y-scroll">
        <div v-if="image" :style="`background-image: url('${image.original}');`" class="zoomed-image z-30" @click="show=false" />

        <div v-if="product && image" id="image-choices" class="flex flex-col gap-3 absolute top-1/12 right-1/12">
          <NuxtImg v-for="otherImage in product.images" :key="otherImage.id" :class="{ 'selected': otherImage.id === image.id }" :src="otherImage.thumbnail" class="aspect-square object-fill w-[100px] z-50"  @click="handleSelectedImage(image)" />
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
  .selected {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  img {
    cursor: pointer;
  }
}
</style>
