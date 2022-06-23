<template>
  <div ref="intro" class="hero p-5 text-center bg-image rounded-3">
    <div ref="mask" class="mask">
      <div class="d-flex justify-content-center align-items-center h-100">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseIntro',
  props: {
    image: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: '400px'
    },
    offsetTop: {
      type: String,
      default: null
    }
  },
  mounted () {
    if (!this.image) {
      this.$refs.intro.style.backgroundColor = '#efefefef'
    } else {
      this.$refs.intro.style.backgroundImage = `url("${this.image}")`
    }
    this.$refs.intro.style.height = this.height
    this.$refs.mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    if (this.offsetTop) {
      this.$refs.intro.style.marginTop = this.offsetTop
    }
  }
}
</script>
