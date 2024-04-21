<template>
  <!-- Sizes -->
  <div id="sizes" class="d-flex justify-content-start gap-1" aria-label="Product sizes">
    <button v-for="size in sizes" :key="size" type="button" :class="{ 'btn-outline-secondary': !sizeSelected(size), 'btn-secondary': sizeSelected(size) }" class="btn btn-floating" @click="handleSizeSelection(size)">
      {{ size }}
    </button>
  </div>

  <p class="mt-4 d-flex justify-content-start gap-3">
    <a href class="fw-bold" @click.prevent="$emit('show-size-guide-drawer')">
      {{ $t('Guide des tailles') }}
    </a>

    <span class="fw-light">
      {{ $t('Taille porté', { size: 'S' }) }} | {{ $t('Taille du mannequin', { heigth: 176 }) }}
    </span>
  </p>
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

export default {
  name: 'FashionInformation',
  props: {
    sizes: {
      type: Array,
      required: true
    }
  },
  emits: {
    'show-size-guide-drawer' () {
      return true
    },
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
    sizeSelected (size) {
      // Checks if the size was selected or not
      return size === this.selectedSize
    },
    handleSizeSelection (size) {
      this.selectedSize = size
      this.$emit('update-size', size)
    }
  }
}
</script>
