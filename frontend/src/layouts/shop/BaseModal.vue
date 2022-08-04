<template>
  <div class="modal-wrapper">
    <div v-show="show" class="dropdown-backdrop" @click="$emit('close-modal')" />
    <div ref="link" :class="modalClasses" class="modal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Cart
            </h5>
            <button type="button" class="btn-close close" aria-hidden="true" aria-label="Close" @click="$emit('close-modal')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <!-- <div class="modal-footer">
            <button type="button" class="btn btn-primary">Save changes</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BaseModal',
  props: {
    show: {
      type: Boolean
    }
  },
  emits: {
    'close-modal': () => true
  },
  computed: {
    modalClasses () {
      return [
        this.show ? 'show' : null,
        'fade'
      ]
    }
  },
  watch: {
    show (newValue) {
      if (newValue) {
        this.diplayModal()
      } else {
        this.hideModal()
      }
    }
  },
  mounted () {
    if (this.show) {
      this.diplayModal()
    }
  },
  methods: {
    diplayModal () {
      this.$refs.link.style.display = 'block'
      const html = document.querySelector('html')
      html.style.overflow = 'hidden'
    },
    hideModal () {
      this.$refs.link.style.display = 'none'
      const html = document.querySelector('html')
      html.style.overflow = 'scroll'
    }
  }
}
</script>

<style scoped>
.dropdown-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1035;
}
</style>
