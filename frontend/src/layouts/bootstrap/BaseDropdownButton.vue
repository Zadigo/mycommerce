<template>
  <!-- dropdown-center dropup dropend dropstart -->
  <!-- btn-group -->
  <div ref="link" class="dropdown">
    <button :id="id" :class="buttonClasses" :aria-expanded="show" class="btn dropdown-toggle" type="button" @click="toggleShow">
      <!-- <span v-if="icon" :class="{ [`mdi-${icon}`]: true }" class="mdi me-2"></span> -->
      <font-awesome-icon v-if="icon" :icon="`fa-solid fa-${item.icon}`" class="me-2" />
      {{ buttonName }}
    </button>

    <!-- <button :class="buttonClasses" :aria-expanded="show" type="button" class="btn dropdown-toggle dropdown-toggle-split" @click="toggleShow">
      <span class="visually-hidden">Toggle Dropdown</span>
    </button> -->

    <!-- :name="animation" -->
    <transition :name="animation" mode="in-out">
      <!-- dropdown-menu-end -->
      <ul v-if="show" :class="{show, 'dropdown-menu-dark': darkMode}" :aria-labelledby="id" class="dropdown-menu p-2">
        <!-- <form class="p-2 mb-2 bg-light border-bottom">
          <input type="search" class="form-control" autocomplete="false" placeholder="Type to filter...">
        </form> -->

        <template v-for="(item, i) in items" :key="item.name">
          <li>
            <h6 v-if="item.header" class="dropdown-header rounded-2">{{ item.name }}</h6>
            <hr v-else-if="item.divider" class="dropdown-divider">
            <a v-else :class="showActive && selected === i ? 'active' : null" class="dropdown-item rounded-2" href @click.prevent="dropdownClick(i, item)">
              <font-awesome-icon v-if="item.icon" :icon="`fa-solid fa-${item.icon}`" class="me-2" />
              <!-- <span v-if="item.icon" :class="{ [`mdi-${item.icon}`]: true }" class="mdi me-2"></span> -->
              {{ item.name }}
            </a>
          </li>
        </template>
      </ul>
    </transition>
  </div>
</template>

<script>
import { ref, inject } from 'vue'
import { useClickOutside } from './composables/index'

export default {
  name: 'BaseDropdownButton',
  props: {
    animation: {
      type: String,
      default: 'slideup'
    },
    buttonName: {
      type: String
    },
    color: {
      type: String,
      default: 'primary'
    },
    id: {
      type: String
    },
    icon: {
      type: String
    },
    items: {
      type: Array,
      required: true
    },
    showActive: {
      type: Boolean
    },
    size: {
      type: String,
      default: 'md'
    }
  },
  emits: {
    'dropdown-click' () {
      return true
    },
    'dropdown-closed' () {
      return true
    },
    'dropdown-opened' () {
      return true
    }
  },
  setup () {
    const target = ref(null)
    const { show, toggleShow } = useClickOutside(target)
    const darkMode = inject('darkMode', false)
    const buttonWidth = 0
    return {
      buttonWidth,
      darkMode,
      show,
      target,
      toggleShow
    }
  },
  data () {
    return {
      selected: 0
    }
  },
  computed: {
    buttonClasses () {
      return [
        this.show ? 'show' : null,
        {
          [`btn-${this.size}`]: true,
          [`btn-${this.color}`]: true
        }
      ]
    }
  },
  watch: {
    show (current) {
      if (!current) {
        this.$emit('dropdown-closed')
      } else {
        this.$emit('dropdown-opened')
      }
    }
  },
  mounted () {
    this.target = this.$refs.link
    // const dropdown = this.$refs.drop
    // const button = dropdown.querySelector('button')
    this.buttonWidth = this.$refs.link.offsetWidth
    // this.$refs.link.style.animation = `${this.animation} .3s ease`
  },
  methods: {
    dropdownClick (index, item) {
      this.selected = index
      this.toggleShow()
      this.$emit('dropdown-click', [index, item])
    }
  } 
}  
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  position: absolute;
  transition: all .3s ease;
  margin: 0px;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(.9, .9);
}

.scale-enter-to,
.scale-leave-from {
  opacity: 1;
  transform: scale(1, 1);
}

.slide-enter-active,
.slide-leave-active {
  position: absolute;
  transition: all .3s ease;
  margin: 0px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0px);
}

.slideup-enter-active,
.slideup-leave-active {
  position: absolute;
  transition: all .3s ease;
  margin: 0px;
}

.slideup-enter-from,
.slideup-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.slideup-enter-to,
.slideup-leave-from {
  opacity: 1;
  transform: translateY(0px);
}

.dropdown-divider {
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.175) !important;
  opacity: 1;
}

.dropdown-item.active,
.dropdown-item:active {
  color: #fff;
  text-decoration: none;
  background-color: #0d6efd;
}
</style>
