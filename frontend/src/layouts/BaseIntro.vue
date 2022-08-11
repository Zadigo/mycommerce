<template>
  <div ref="intro" :class="introClasses" class="hero bg-image">
    <div ref="mask" class="mask">
      <div :class="wrapperClasses" class="h-100">
        <slot></slot>
      </div>
      <!-- <div class="d-flex justify-content-center align-items-center h-100">
      </div> -->
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
    // backgroundColor: {
    //   type: String,
    //   default: null
    // },
    introClasses: {
      type: String,
      default: 'p-5 text-center'
    },
    wrapperClasses: {
      type: String,
      default: 'd-flex justify-content-center align-items-center'
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
      // this.$refs.intro.style.backgroundColor = '#efefefef'
      this.$refs.intro.style.backgroundColor = '#fff'
    } else {
      this.$refs.intro.style.backgroundImage = `url("${this.image}")`
      this.$refs.mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    }
    this.$refs.intro.style.height = this.height
    if (this.offsetTop) {
      this.$refs.intro.style.marginTop = this.offsetTop
    }
  }
}
</script>
