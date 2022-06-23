import { h } from 'vue'

export default {
  name: 'IntroMask',
  props: {
    opacity: {
      type: Number,
      default: 0.8
    }
  },
  render () {
    const options = {
      class: [
        'mask'
      ],
      backgroundColor: `rgba(0, 0, 0, ${this.opacity})`,
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100',
      overflow: 'hidden',
      backgroundAttachment: 'fixed',
      ref: 'mask'
    }
    return h('div', options, () => [])
  }
}
