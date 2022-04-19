<template>
  <section class="ecommerce-section">
    <v-container>
      <v-row>
        <v-col class="border-right p-3" cols="4">
          <h2>{{ $t('Find a store') }}</h2>
          <v-btn @click="getLocation">{{ $t('Find my location') }}</v-btn>

          <v-text-field :placeholder="$t('City, Zip code...')" type="text" v-model="storeLocation" solo></v-text-field>
        </v-col>

        <v-col cols="8">
          <v-img :src="require('@/assets/map.png')"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  name: 'StoreFinderView',
  data: () => ({
    storeLocation: null
  }),
  methods: {
    async getLocation() {
      try {
        var coordinates = await this.$getLocation({})
        console.log(coordinates)
      } catch(error) {
        this.$store.dispatch('addErrorMessage', error)
      }
    }
  }
}
</script>
