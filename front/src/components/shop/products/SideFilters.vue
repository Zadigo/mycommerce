<template>
  <transition name="filters-transition">

    <aside v-if="!hideFilters" id="product-filters" class="col-2">
      <v-expansion-panels class="border" flat>
        <v-expansion-panel v-for="(section, x) in Object.keys(sections)" :key="x" accordion>
          <v-expansion-panel-header class="font-weight-bold">
            {{ $t(section) }}
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-checkbox v-for="variant in Object.keys(sections[section])" :key="variant" v-model="selectedElements[section][variant]" :label="variant" hide-details @click="filterProducts"></v-checkbox>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </aside>
  
  </transition>
</template>

<script>
var _ = require('lodash')

import { mapGetters } from 'vuex'

import fashion from '@/data/fashion.json'

export default {
  name: 'SideFilters',
  
  props: {
    hideFilters: {
      type: Boolean
    }
  },

  data: () => ({
      searchedPrice: [],
      minPrice: 0,
      maxPrice: 150,

      selectedElements: {
        size: {},
        color: {},
        brand: {},
        material: {},
        cut: {},
        season: {},
        novelties: {},
        delivery: {}
      }
  }),

  computed: {
    ...mapGetters(['searchedProducts']),

    sections () {
      return {
        size: this.sizes,
        color: [],
        brand: [],
        material: this.material,
        cut: [],
        season: [],
        novelties: [],
        delivery: []
      }
    },

    sizes () {
      var container = {}
      _.forEach(fashion.sizes, (label) => {
        container[label] = false
      })
      return container
    },

    material () {
      var container = {}
      // TODO: Maybe limit the number of items
      // shown according to the materials present
      // in the backend
      _.forEach(fashion.material, (material) => {
        container[material] = false
      })
      return container
    },

    hasSelection () {
      var results = []
      _.forEach(Object.keys(this.selectedElements), (key) => {
        var container = _.map(Object.values(this.selectedElements[key]), (item) => {
          return item ? true : false
        })
        Object.assign(results, container)
      })
      return _.some(results)
    },

    dynamicUrl () {
      // The only purpose of this property is to display
      // the user selections in the url of the current
      // page and to also construct the query path
      // the filter API function below
      var validSelections = _.filter(Object.entries(this.onlySelected), (entry) => {
        return entry[1] !== ""
      })

      // [["size", "xs,s"], ...]
      var subQueries = []
      _.forEach(validSelections, (selection) => {
        var subQuery = ''
        subQuery = `${ selection[0] }=${ selection[1] }`
        subQueries.push(subQuery)
      })

      var query = _.join(subQueries, '&')
      var fullQuery = `?${ query }`
      var instance = new URLSearchParams(fullQuery)
      return instance.toString()
    },

    onlySelected () {
      // Returns a dictionnary of the items with only
      // the items that were selected by the user
      var result = {}
      _.forEach(Object.keys(this.selectedElements), (key) => {
        var selection = Object.entries(this.selectedElements[key])
        // [["xs", true], ["s", false], ...]
        var container = _.map(selection, (item) => {
          return item[1] ? item[0] : false
        })
        result[key] = _.join(container, ',')
      })
      return result
    },

    // onlySelected() {
    //   // Returns only the items that were
    //   // selected by the user in selectedElements
    //   var results = []
    //   _.forEach(Object.keys(this.selectedElements), (key) => {
    //     var selection = Object.entries(this.selectedElements[key])
    //     // [["xs", true], ["s", false], ...]
    //     var container = _.map(selection, (item) => {
    //       return item[1] ? item[0] : false
    //     })
    //     results.push(...container)
    //   })
    //   return results
    // },

    numberOfSelections () {
      return this.onlySelected.length
    }
  },

  methods: {
    filterProducts () {
      this.$emit('selection-start')
      setTimeout(() => {
        this.$api.shop.products.filterBy(this.dynamicUrl)
        .then((response) => {
          response
          this.$emit('selection-end')
          
          // TODO: Generate a PageView also because
          // this is considered as a search
        })
        .catch((error) => {
          error
        })
      }, 1000)
    }
  }
}
</script>

<style scoped>
.filters-transition-enter-active,
.filters-transition-leave-active {
    transition: all .2s ease-in-out;
}

.filters-transition-enter,
.filters-transition-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.filters-transition-leave,
.filters-transition-enter-to {
    opacity: 1;
    transform: translateX(0px);
}

.filters-transition-move {
    transition: all .2s ease-in-out;
}
</style>
