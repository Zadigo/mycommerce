<template>
  <div id="product-images-6" class="col-12">
    <div class="row g-1">
      <div v-for="image in images" :key="image.id" class="col-4">
        <v-img :src="djangoMediaPath(image.original)" :lazy-src="djangoMediaPath(image.original)" :alt="image.name" />
      </div>
    </div>
  </div>
</template>

<script>
import { useUtilities } from 'src/composables/shop'

export default {
  name: 'SixImages',
  props: {
    images: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup () {
    const { djangoMediaPath } = useUtilities()
    return {
      djangoMediaPath
    }
  }
}
</script>
