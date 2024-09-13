<template>
  <div id="product-images-5" class="col-12">
    <div class="row g-1">
      <div v-for="image in firstImages" :key="image.id" class="col-6">
        <v-img :src="djangoMediaPath(image.original)" :lazy-src="djangoMediaPath(image.original)" :alt="image.name" />
      </div>

      <div v-for="image in lastImages" :key="image.id" class="col-4">
        <v-img :src="djangoMediaPath(image.original)" :lazy-src="djangoMediaPath(image.original)" :alt="image.name" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useShopUtilities } from 'src/composables/shop'

export default {
  name: 'SixImages',
  props: {
    images: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup (props) {
    const { djangoMediaPath } = useShopUtilities()

    const firstImages = computed(() => {
      return props.images.slice(0, 2)
    })

    const lastImages = computed(() => {
      return props.images.slice(2, props.images.length)
    })

    return {
      firstImages,
      lastImages,
      djangoMediaPath
    }
  }
}
</script>
