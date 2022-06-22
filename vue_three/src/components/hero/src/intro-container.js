import { h } from 'vue'

export default {
  name: 'IntroContainer',
  props: {
    alignItems: {
      type: String,
      default: 'center'
    },
    justifyContent: {
      type: String,
      default: 'center'
    },
    textCenter: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    computedClass () {
      return [
        'container',
        'd-flex',
        {
          [`align-items-${this.alignItems}`]: true,
          [`justify-content-${this.justifyContent}`]: true,
          'text-center': this.textCenter
        },
        'h-100'
      ]
    }
  },
  render () {
    const options = {
      class: this.computedClass,
      ref: 'container'
    }

    return h('div', options, [])
  }
}
