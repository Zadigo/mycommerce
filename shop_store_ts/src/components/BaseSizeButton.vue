<template>
  <button v-if="size.availability" type="button" :class="buttonClass" @click="handleSizeSelection(size)">
    {{ size.name }}
  </button>

  <button v-else-if="!size.availability" type="button" :class="buttonClass" @click="handleSizeSelection(size)">
    <font-awesome-icon icon="clock-rotate-left" class="text-warning me-2" />
    {{ size.name }}
  </button>
</template>

<script lang="ts">
import { ProductSizes } from '@/types/shop';
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'BaseSizeButton',
  props: {
    size: {
      type: Object as PropType<ProductSizes>,
      required: true
    },
    selectedSize: {
      type: String,
      default: null
    },
    selectable: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    'update:selectedSize' (_size: string) {
      return true
    }
  },
  setup () {
    const modelValue = ref<ProductSizes | null>(null)
    return {
      modelValue
    }
  },
  computed: {
    currentSize (): ProductSizes | null {
      return this.modelValue
    },
    isSelected () {
      return this.size.name === this.selectedSize
    },
    buttonClass () {
      return [
        'btn',
        'btn-rounded',
        { 
          'btn-outline-secondary': !this.isSelected,
          'btn-secondary': this.isSelected && this.selectable
        }
      ]
    }
  },
  methods: {
    handleSizeSelection (size: ProductSizes) {
      this.modelValue = size
      this.$emit('update:selectedSize', size.name)
    }
  }
})
</script>
