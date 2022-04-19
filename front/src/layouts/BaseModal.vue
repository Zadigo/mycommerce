<template>
  <transition name="slide-transition">
    <div ref="link" :class="modalClasses" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel">
      <div :class="dialogClasses" class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-if="title">{{ title }}</h5>
            <slot name="modal-header"></slot>
            <button type="button" class="btn-close" aria-label="Close" @click="$emit('modal-close')"></button>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>

          <div v-if="hasFooter" class="modal-footer">
            <slot name="modal-footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    bodyClass: {
      type: String
    },
    centered: {
      type: Boolean
    },
    scrollable: {
      type: Boolean
    },
    show: {
      type: Boolean
    },
    size: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    }
  },
  watch: {
    show(newValue) {
      if (newValue) {
        this.$refs.link.style.display = 'block'
        
        var roleAttr = document.createAttribute('role')

        roleAttr.value = 'dialog'
        this.$refs.link.attributes.setNamedItem(roleAttr)
      } else {
        this.$refs.link.style.display = 'none'
        
        var ariaAttr = document.createAttribute('aria-hidden')

        this.$refs.link.attributes.removeNamedItem('role')
        ariaAttr.value = true
      }
    } 
  },
  computed: {
    hasFooter() {
      return this.$slots['modal-footer'] ? true : false
    },

    modalClasses() {
      return [
        this.bodyClass,
        this.show ? 'show' : null
      ]
    },

    dialogClasses() {
      return [
        {
          'modal-dialog-centered': this.centered,
          [`modal-${this.size}`]: true,
          [`modal-dialog-scrollable`]: this.scrollable
        }
      ]
    }
  }
}
</script>

<style scoped>
  .slide-transition-enter-active {
    transition: all .3s ease-in;
  }
  .slide-transition-leave-active {
    transition: all .3s ease-in;
  }
  .slide-transition-enter,
  .slide-transition-leave-to {
    opacity: 0;
    transform: translateY(-25px);
  }

  .slide-transition-enter-to,
  .slide-transition-leave {
    opacity: 1;
    transform: translateY(0px);
  }
</style>
