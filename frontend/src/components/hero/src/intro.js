import { h } from 'vue'

export default {
  name: 'BaseIntro',
  props: {
    height: {
      type: Number,
      default: 100
    },
    image: {
      type: String,
      default: null
    },
    backgroundPosition: {
      type: [String, Number],
      default: '50%'
    }
  },
  computed: {
    normalizePosition () {
      if (typeof this.backgroundPosition === 'number') {
        return `${this.backgroundPosition}%`
      } else {
        if (this.backgroundPosition.includes('%')) {
          return this.backgroundPosition
        } else {
          return `${this.backgroundPosition}%`
        }
      }
    }
  },
  mounted () {
    this.$refs.intro.style.backgroundImage = `url('${this.image}')`
  },
  render () {
    const options = {
      id: [
        'intro'
      ],
      class: [
        'shadow-2-strong'
      ],
      style: {
        transition: 'all .4s ease',
        height: `${this.height}vh`,
        position: 'relative',
        overflow: 'hidden',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: this.normalizePosition
      },
      ref: 'intro'
    }

    return h('section', { class: ['hero'] }, [
      h('div', options)
    ])
  }
}
