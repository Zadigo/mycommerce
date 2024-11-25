<template>
  <div id="product-images" class="col-6">
    <div id="main-image">
      <BaseSkeleton :loading="isLoading" height="836px">
        <v-img :src="mediaPath(product?.get_main_image?.original)" :alt="product?.name" />
      </BaseSkeleton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Product } from '~/types';

defineProps({
  product: {
    type: Object as PropType<Product | null>,
    required: true
  }
})

const { mediaPath } = useDjangoUtilies()
const isLoading = ref(false)
</script>
