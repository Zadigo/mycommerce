<template>
  <div id="sizes" class="d-flex justify-content-start gap-1" aria-label="Product sizes">
    <base-size-button v-for="size in sizes" :key="size.id" v-model:selectedSize="selectedSize" :size="size" @click="handleSizeSelection" />
  </div>
</template>

<script lang="ts">
/**
 * 
 * Provides the correct section for the consumer on products
 * that require size selection (X, XS, S...) or information on 
 * the model that is carrying clothing
 * 
 */ 
import { ProductSizes } from '@/types/shop';
import { useRefHistory } from '@vueuse/core';
import { defineComponent, PropType, ref } from 'vue';

import BaseSizeButton from './BaseSizeButton.vue';

export default defineComponent({
  name: 'BaseSizeBlock',
  components: {
    BaseSizeButton
  },
  props: {
    sizes: {
      type: Array as PropType<ProductSizes[]>,
      required: true,
      default: () => []
    }
  },
  emits: {
    'update-size' (_size: string | null) {
      return true
    }
  },
  setup () {
    const selectedSize = ref<string | null>(null)
    const { history } = useRefHistory(selectedSize)

    return {
      history,
      selectedSize
    }
  },
  methods: {
    /**
     * 
     */
    handleSizeSelection () {
      this.$emit('update-size', this.selectedSize)
    }
  }
})
</script>
