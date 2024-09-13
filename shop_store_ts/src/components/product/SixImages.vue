<template>
  <div id="product-images-6" class="col-12">
    <div class="row g-1">
      <div v-for="image in images" :key="image.id" class="col-4">
        <v-img :src="djangoMediaPath(image.original)" :lazy-src="djangoMediaPath(image.original)" :alt="image.name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useShopUtilities } from 'src/composables/shop'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SixImages',
  props: {
    images: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup () {
    const { djangoMediaPath } = useShopUtilities()
    return {
      djangoMediaPath
    }
  }
})
</script>
