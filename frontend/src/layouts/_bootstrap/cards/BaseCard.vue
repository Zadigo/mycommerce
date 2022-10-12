<template>
  <div ref="link" :class="cardClasses" class="card">
    <div v-if="hasHeader" class="card-header">
      <slot name="header"></slot>
    </div>
    <!-- bottom -->
    <img v-if="image && imagePosition === 'top'" :src="image" :alt="imageAlt" :class="imageClasses">
    
    <div v-if="overlay" class="card-img-overlay">
      <slot></slot>
    </div>
    <div v-else class="card-body">
      <h5 v-if="title" class="card-title">
        {{ title }}
        <!-- <button type="button" class="btn btn-floating bg-white shadow-none" @click="reveal=true">
          <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
        </button> -->
      </h5>
      <h6 v-if="subtitle" class="card-subtitle mb-2 text-muted">{{ subtitle }}</h6>
      <p class="card-text"><slot name="body"></slot></p>
      <a v-for="(link, i) in links" :key="i" href="#" class="card-link">Card link</a>
    </div>

    <slot></slot>

    <img v-if="image && imagePosition === 'bottom'" :src="image" :alt="imageAlt" :class="imageClasses">
    
    <div v-if="!overlay && hasFooter" class="card-footer">
      <slot name="footer"></slot>
    </div>

    <!-- <transition name="slide">
      <div v-show="reveal" class="reveal">
        <div class="row">
          <div class="col-12 mb-2">
            <button type="button" class="btn-close me-auto" @click="reveal=false"></button>
          </div>
        </div>
        <slot name="reveal"></slot>
      </div>
    </transition> -->

    <!-- <a class="btn btn-floating btn-primary text-white halfway-fab" href>
      <font-awesome-icon icon="fa-solid fa-plus" />
    </a> -->

    <!-- <div class="stats">
      <div class="one-third">
        <div class="stat">$20</div>
        <div class="stat-value">Training</div>
      </div>
    
      <div class="one-third">
        <div class="stat">16</div>
        <div class="stat-value">Speed</div>
      </div>
    
      <div class="one-third">
        <div class="stat">$150</div>
        <div class="stat-value">Cost</div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'BaseCard',
  props: {
    image: {
      type: String
    },
    hoverable: {
      type: Boolean
    },
    imagePosition: {
      type: String,
      default: 'top'
    },
    imageAlt: {
      type: String,
    },
    overlay: {
      type: Boolean
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    links: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { slots }) {
    const darkMode = inject('darkMode')
    const cardHeight = null

    const hasHeader = !!slots.header
    const hasFooter = !!slots.footer
    const hasReveal = !!slots.reveal
    return {
      darkMode,
      hasHeader,
      hasFooter,
      hasReveal,
      cardHeight
    }
  },
  data () {
    return {
      reveal: false
    }
  },
  computed: {
    cardClasses () {
      return [
        this.darkMode ? 'bg-dark': null,
        this.hoverable ? 'hoverable' : null,
        this.overlay ? 'text-bg-dark': null,
        this.hasReveal ? 'card-reveal': null
      ]
    },
    imageClasses () {
      if (this.overlay) {
        return [
          'card-img'
        ]
      }
      
      if (this.imagePosition === 'top') {
        return [
          'card-img-top'
          // 'waves-effect'
          // 'shadow-sm'
        ]
      }
      
      if (this.imagePosition === 'bottom') {
        return [
          'card-img-top'
        ]
      }

      return [
        'card-img-top'
      ]
    }
  },
  mounted () {
    this.cardHeight = this.$refs.link.offsetHeight
  }
}
</script>

<style scoped>
.text-bg-dark {
  color: #fff !important;
  background-color: rgba(33, 37, 41, 1, 1) !important;
}

.stats {
  /* background: #ec9b3b; */
  background: rgba(0, 0, 0, 0.03);
  /* color: white; */
  /* color: rgba(38, 38, 38, 1); */
  color: #212529;
  font-weight: 700;
  border-bottom-left-radius: .5rem;
  border-bottom-right-radius: .5rem;
  /* border-top: 1px solid rgba(0, 0, 0, 0.175); */
  text-align: center;
}
.stats .one-third {
  width: 33%;
  float: left;
  padding: 20px 15px;
}

.stats .stat {
  position: relative;
  font-size: 24px;
}

.stats .stat-value {
  text-transform: uppercase;
  font-weight: 400;
  font-size: 12px;
}
.stats .one-third:not(:last-child) {
  /* border-right: 1px solid #bd7c2f; */
  border-right: 1px solid rgba(0, 0, 0, 0.175);
}
.card .halfway-fab {
  position: absolute;
  right: 24px;
  bottom: calc((546px / 2 + 18px));
  z-index: 4;
}

.waves-effect {
  position: relative;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  user-select: none;
  vertical-align: middle;
  z-index: 1;
  transition: .3s ease-out;
}

.card-reveal {
  overflow: hidden;
}
.reveal {
  position: absolute;
  background-color: #fff;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: calc(.5rem - 1px);
  z-index: 5;
  padding: 1rem;
}
.slide-enter-active,
.slide-leave-active {
  transition: all .3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateY(0%);
}
.card-reveal .card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card.hoverable {
  transition: transform 0.1s ease-in-out;
}
.card.hoverable:hover {
  transform: translateY(-0.5rem) scale(1.0125);
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
}
</style>
