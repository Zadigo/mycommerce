<template>
  <div ref="link" :class="[darkMode ? 'dark' : null]" class="input-menu">
    <div class="input-group">
      <slot></slot>     

      <span class="input-group-text bg-transparent">
        <font-awesome-icon v-if="showMenu" icon="fa-solid fa-caret-up" />
        <font-awesome-icon v-else icon="fa-solid fa-caret-down" />
      </span>

      <button v-if="clearable" type="button" class="btn bg-transparent border-left-0 border shadow-none" @click="handleClearInput">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
    </div>

    <transition name="scale">
      <ul v-if="showMenu" :class="[showMenu ? 'show' : null]" class="items">
        <li v-for="(item, i) in filterValues" :key="i" class="item" @click.prevent="selectValue(item)">
          {{ item.text }}
        </li>

        <li v-if="filterValues.length === 0" class="item" @click.prevent="selectValue(item)">
          Nothing to show
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'BaseAutocomplete',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    clearable: {
      type: Boolean
    }
  },
  emits: {
    'item-selected' (item) {
      if (!(typeof item !== 'object')) {
        return false
      }
      return true
    }
  },
  setup () {
    const inputHeight = 0
    const target = null
    const darkMode = inject('darkMode', false)
    return {
      darkMode,
      inputHeight,
      target
    }
  },
  data () {
    return {
      showMenu: false,
      selected: {},
      selectedMultiple: [],
      value: null
    }
  },
  computed: {
    filterValues () {
      if (!this.value) {
        return this.items
      } else {
        return this.items.filter((item) => {
          return item.text.includes(this.value) || item.text === this.value
        })
      }
    }
  },
  mounted () {
    this.target = this.$refs.link.querySelector("input")
    // this.inputHeight = target.offsetHeight
    // this.$refs.link.querySelector(".items").style.marginTop = "10px"
    this.target.addEventListener("focusin", this.handleInputFocus)
    this.target.addEventListener("focusout", this.handleInputFocusLeave)
    this.target.addEventListener("keyup", this.handleInputKeyUp)
  },
  beforeUnmount () {
    this.target.removeEventListener("focusin", this.handleInputFocus)
    this.target.removeEventListener("focusout", this.handleInputFocusLeave)
    this.target.removeEventListener("keyup", this.handleInputKeyUp)
  },
  methods: {
    handleInputFocus () {
      this.showMenu = true
    },
    handleInputFocusLeave () {
      this.showMenu = false
    },
    handleInputKeyUp (e) {
      this.value = e.target.value
    },
    selectValue (item) {
      this.selected = item
      this.target.value = item.text
      this.$emit("item-selected", item)
    },
    handleClearInput () {
      this.value = null
      this.target.value = null
    }
  }
}
</script>

<style scoped>
  /* TODO: Improve dark mode */
.input-menu {
    position: relative;
  }

  .input-menu .items {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    width: 100%;
    height: auto;
    min-width: 10rem;
    border-radius: 0.375rem;
    font-size: 1rem;
    margin-top: 3.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
    background-clip: padding-box;
    padding: 0.5rem 0;
    z-index: 1000;
  }

  .input-menu .items.show {
    display: block;
  }
  
  .input-menu .item {
    padding: 0.5rem 1rem;
    list-style: none;
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    text-decoration: none;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
    cursor: pointer;
  }

  .input-menu .item:focus,
  .input-menu .item:hover {
    color: #1e2125;
    background-color: #e9ecef;
  }
 
  .input-menu.dark .items {
    background-color: #1e2125;
  }
  
  .input-menu.dark li {
    color: #fff;
  }

  .input-menu.dark .item:focus,
  .input-menu.dark .item:hover {
    color: #fff;
    background-color: rgba(38, 38, 38, .5);
  }

  .scale-enter-active, .scale-leave-active {
    transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .scale-enter-from, .scale-leave-to {
    opacity: 0;
    transform: scale(0.9, 0.9);
  }
  
  .scale-enter-to, .scale-leave-from {
    opacity: 1;
    transform: scale(1, 1);
  }
</style>
