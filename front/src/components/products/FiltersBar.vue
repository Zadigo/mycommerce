<template>
  <nav ref="link" class="navbar navbar-expand-lg navbar-light my-5">
    <div class="container">
      <div class="collapse navbar-collapse flex-column justify-content-left align-items-start">
        <ul class="navbar-nav">
          <li class="nav-item mx-2">
            <v-btn icon @click="$emit('change-grid')">
              <v-icon>mdi-grid</v-icon>
            </v-btn>
          </li>

          <!-- Sort method -->
          <li class="nav-item mx-1">
            <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on">
                  <v-icon class="mr-2">mdi-sort</v-icon>
                  {{ $t(sortMethod) }}
                </v-btn>
              </template>

              <v-list>
                <v-list-item v-for="method in sortMethods" :key="method" @click="doSort(method)">
                  <v-list-item-title>{{ method }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </li>

          <!-- Size -->
          <li class="nav-item mx-1">
            <v-btn text @click="openFilters('size')">
              {{ $t('Size') }}
              <v-icon class="ms-1">mdi-chevron-down</v-icon>
            </v-btn>
          </li>

          <!-- Colors -->
          <li class="nav-item mx-1">
            <v-btn text @click="openFilters('colors')">
              {{ $t('Color') }}
              <v-icon class="ms-1">mdi-chevron-down</v-icon>
            </v-btn>
          </li>
        </ul>
        
        <transition name="slide-transition">
          <div v-if="showFilters" id="filters" class="d-flex justify-content-center" style="flex-wrap:wrap;">
            <!-- Sizes -->
            <div v-if="selectedFilter == 'size'">
              <v-chip v-for="(size, i) in sizes" :key="i" class="mx-1" link @click="setSearchItem('sizes', size)">
                {{ size }}
              </v-chip>
            </div>

            <!-- Colors -->
            <div v-else-if="selectedFilter == 'colors'" class="d-flex justify-content-around">
              <v-img v-for="(color, i) in colors" :key="i" :src="color[1]" id="color" class="mx-2" height="50px" width="50px" @click="setSearchItem('colors', color[0])"></v-img>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script>
var _ = require('lodash')

import { mapState } from 'vuex'

export default {
  name: 'FiltersBar',

  props: {
    multipleGridDisplay: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    select: null,
    items: [],
    sortMethod: 'Latest',
    sortMethods: [
      'Latest',
      'Alphabetically A-Z',
      'Alphabetically Z-A',
      'Price high to low', 
      'Price low to high'
    ],

    showFilters: false,
    selectedFilter: 'size',

    selectedElements: {
        sizes: [],
        colors: [],
        // brand: {},
        // material: {},
        // cut: {},
        // season: {},
        // novelties: {},
        // delivery: {}
    },

    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }),
  
  computed: {
    ...mapState({
      productNames: (state) => {
        var names = []
        _.forEach(state.shopModule.products, (product) => {
          names.push(product.name)
        })
        return names
      }
    }),

    colors () {
      var items = ['beige', 'black', 'camel', 'red']
      return _.map(items, (item) => {
        return [item, this.$options.filters.mediaUrl(`/media/swatches/${ item }.png`)]
      })
    },

    searchQuery() {
        var items = new URLSearchParams({...this.selectedElements})
        return `?${items}`
    }
  },

  methods: {
    doSort(method) {
      this.sortMethod = method
      this.$emit('do-sort', method)
    },

    openFilters(method) {
      this.selectedFilter = method
      this.showFilters = !this.showFilters
    },

    handleScroll() {
      if (document.documentElement.scrollTop > 350) {
        this.$refs.link.classList.add('scrolled')
      } else {
        this.$refs.link.classList.remove('scrolled')
      }
    },

    setSearchItem(key, value) {
      // TODO: Make a global function that allows
      // us to dynamically push/remove a value from
      // an array based non a selection
      var values = this.selectedElements[key]
      if (values.includes(value)) {
        var indexOfValue = _.indexOf(values, value) 
        values.splice(0, indexOfValue)
      } else {
        values.push(value)
      }
      this.selectedElements[key] = values
      this.getProducts()
    },

    async getProducts() {
      try {
        this.$emit('loading-products-start')
        var response = await this.$axios.get(`/shop/advanced/search${this.searchQuery}`)
        this.$store.commit('setProducts', response.data)
        this.$emit('loading-products-end')
      } catch(error) {  
        console.log(error)
      }
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
.navbar {
  transition: all .4s ease-in-out;
}

.nav-collapse {
  position: relative;
}

#filters {
  width: 100%;
  height: auto;
  min-height: 100px;
  padding: .25rem;
  margin-top: 2rem;
}

.slide-transition-enter-active,
.slide-transition-enter-active {
  transition: all .4s ease;
}

.slide-transition-enter,
.slide-transition-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(.9, .9);
}

.slide-transition-leave,
.slide-transition-enter-to {
  opacity: 1;
  transform: translateY(0px) scale(1, 1);
}

.slide-transition-move {
  transition: all .3s ease;
}

.navbar {
  transition: all .3s ease-in-out;
}

.navbar.scrolled {
  position: fixed;
  display: block;
  top: 15%;
  left: 25%;
  right: 25%;
  border: 0;
  width: auto;
  background-color: white;
  padding: .10rem;
}

#color {
  cursor: pointer;
}
</style>
