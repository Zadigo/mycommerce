<template>
  <button v-if="size.availability" type="button" :class="buttonClass" @click="handleSizeSelection(size)">
    {{ size.name }}
  </button>

  <button v-else-if="!size.availability" type="button" :class="buttonClass" @click="handleSizeSelection(size)">
    <font-awesome-icon :icon="[ 'fas', 'clock-rotate-left' ]" class="text-warning me-2" />
    {{ size.name }}
  </button>
</template>

<script>
export default {
  name: 'BaseSizeButton',
  props: {
    size: {
      type: Object,
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
    'update:selectedSize' () {
      return true
    }
  },
  setup (props) {
    props
  },
  computed: {
    currentSize () {
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
    handleSizeSelection (size) {
      this.$emit('update:selectedSize', size.name)
    }
  }
}
</script>
