<template>
  <div id="tag" ref="tag" :class="classes" class="darken-1 text-uppercase text-white font-weight-bold rounded mb-5 text-center">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseTag',

  props: {
    backgroundColor: {
      type: String,
      default: 'primary'
    },
    width: {
      type: Number,
      default: 20
    },
    isAbsolute: {
      type: Boolean
    },
    top: {
      type: Number,
      default: 0
    },
    left: {
      type: Number, 
      default: 0
    },
    padding: {
      type: Number,
      default: 3
    }
  },

  computed: {
    classes () {
      return [
        this.backgroundColor,
        {
          [`p-${ this.padding }`]: true
        }
      ]
    }
  },

  mounted() {
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
