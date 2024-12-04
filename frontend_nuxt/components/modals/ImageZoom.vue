<template>
  <v-dialog v-model="showImageDetails" fullscreen hide-overlay scrollable transition="dialog-bottom-transition">
    <v-card class="position-relative">
      <div v-if="image" :style="`background-image: url('${image.original}');`" class="zoomed-image" @click="emit('close')" />

      <div v-if="product && image" id="image-choices" class="d-flex flex-column gap-3">
        <NuxtImg v-for="otherImage in product.images" :key="otherImage.id" :class="{ 'selected': otherImage.id === image.id }" :src="otherImage.thumbnail" width="100px" @click="handleSelectedImage(image)" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Product, ProductImage } from '~/types';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object as PropType<Product | null>,
    required: true
  },
  image: {
    type: Object as PropType<ProductImage | null | undefined>,
    required: true
  }
})

const emit = defineEmits({
  close () {
    return true
  },
  'select-image' (_image: ProductImage) {
    return true
  }
})

const { handleSelectedImage } = useImages()

const showImageDetails = computed({
  get: () => props.show,
  set: () => {
    emit('close')
  }
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
