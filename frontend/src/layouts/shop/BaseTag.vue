<template>
  <div id="tag" ref="tag" :class="classes" class="text-uppercase text-white fw-bold rounded text-center">
    <slot></slot>
  </div>
</template>

<script>
import { useUtilities } from '@/composables/utils'

export default {
  name: 'BaseTag',
  props: {
    backgroundColor: {
      type: String,
      default: 'primary'
    },
    isAbsolute: {
      type: Boolean
    },
    left: {
      type: Number,
      default: 0
    },
    padding: {
      type: Number,
      default: 1
    },
    top: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 30
    }
  },
  setup () {
    const { formatAsPercentage } = useUtilities()
    return {
      formatAsPercentage
    }
  },
  computed: {
    classes () {
      return [
        this.backgroundColor,
        {
          [`p-${this.padding}`]: true
        }
      ]
    }
  },
  mounted () {
    this.$refs.tag.style.width = this.formatAsPercentage(this.width)
    this.positionItem()
  },
  updated () {
    this.positionItem()
  },
  methods: {
    positionItem () {
      if (this.isAbsolute) {
        this.$refs.tag.style.position = 'absolute'
        this.$refs.tag.style.top = this.formatAsPercentage(this.top)
        this.$refs.tag.style.left = this.formatAsPercentage(this.left)
      }
    }
  }
}
</script>
