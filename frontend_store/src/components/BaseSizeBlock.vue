<template>
  <!-- Sizes -->
  <div id="sizes" class="d-flex justify-content-start gap-1" aria-label="Product sizes">
    <base-size-button v-for="size in sizes" :key="size.id" v-model:selectedSize="selectedSize" :size="size" @click="handleSizeSelection(size)" />
  </div>
</template>

<script>
/**
 * 
 * Provides the correct section for the consumer on products
 * that require size selection (X, XS, S...) or information on 
 * the model that is carrying clothing
 * 
 */ 
import { ref } from 'vue'
import { useRefHistory } from '@vueuse/core'

import BaseSizeButton from './BaseSizeButton.vue'

export default {
  name: 'BaseSizeBlock',
  components: {
    BaseSizeButton
  },
  props: {
    sizes: {
      type: Array,
      required: true
    }
  },
  emits: {
    'update-size' () {
      return true
    }
  },
  setup () {
    const selectedSize = ref(null)
    const { history } = useRefHistory(selectedSize)

    return {
      history,
      selectedSize
    }
  },
  methods: {
    handleSizeSelection () {
      this.$emit('update-size', this.selectedSize)
    }
  }
}
</script>
