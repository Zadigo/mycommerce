<template>
  <b-navbar class="border p-4 rounded mdb-color lighten-3 mt-3 mb-5">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>        
        <b-nav-item>
          <v-btn icon @click="$emit('toggle-filters')">
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </b-nav-item>

        <b-nav-item>
          <v-btn icon @click="$emit('change-grid')">
            <v-icon>mdi-grid</v-icon>
          </v-btn>
        </b-nav-item>

        <b-nav-item>
          <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="expand-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on">
                <v-icon class="mr-2">mdi-sort</v-icon>
                {{ sortMethod }}
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-for="method in sortMethods" :key="method" @click="doSort(method)">
                <v-list-item-title>{{ method }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>

    <form class="form-inline">
      <div class="md-form my-0">
        <v-autocomplete v-model="select" :loading="loading" :items="items" :search-input.sync="searchedValue" cache-items flat hide-no-data hide-details solo clearable label="Search for clothes"></v-autocomplete>
      </div>
    </form>
  </b-navbar>
</template>

<script>
var _ = require('lodash')

import { mapState } from 'vuex'

export default {
  name: 'PageNav',

  props: {
    multipleGridDisplay: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    select: null,
    loading: false,
    items: [],
    sortMethod: 'Latest',
    sortMethods: ['Latest', 'Price high to low', 'Price low to high']
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

    searchedValue: {
      get () { return this.$store.state.search },
      set (value) { this.$store.commit('setSearch', value) }
    }
  },

  watch: {
    searchedValue (value) {
      if (value && value != null) {
        setTimeout(() => {
          console.log('search')
        }, 8000);
      }
    }
  },

  methods: {
    doSort (method) {
      this.sortMethod = method
      this.$emit('do-sort', method)
    }
  }
}
</script>
