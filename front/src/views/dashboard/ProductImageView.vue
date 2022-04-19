<template>
  <section id="images">
    <v-row>
      <v-col cols="12">
        <v-btn @click="$router.go(-1)">Back</v-btn>
        <v-btn @click="previousImage">Previous</v-btn>
        <v-btn @click="nextImage">Next</v-btn>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ currentlyViewedImage.name }}
          </v-card-title>
        </v-card>
      </v-col>

      <v-col cols="8">
        <v-img :src="currentlyViewedImage.mid_size|mediaUrl"></v-img>
      </v-col>

      <v-col cols="4">
        <v-card>
          <v-card-title>
            Image title  
          </v-card-title>

          <v-card-text>
            <v-text-field type="text" accept="image/jpg, image/jpeg" label="Name" outlined hide-details show-size></v-text-field>

            <v-switch label="Is main image"></v-switch>
          </v-card-text>

          <v-card-actions>
            <v-btn text>Save</v-btn>
            <v-btn text>Delete</v-btn>  
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </section>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ProductImageView',
  data: () => ({
    images: [],
    currentlyViewedImage: {}
  }),

  watch: {
    '$route.params.id'(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.setCurrentlyViewedImage()
      }
    }
  },

  beforeMount() {
    this.images = this.$session.retrieve('images')
    this.setCurrentlyViewedImage()
  },
  
  methods: {
    async imageDetail() {
      // Pass
    },

    setCurrentlyViewedImage() {
      this.currentlyViewedImage = _.find(this.images['results'], ['id', this.$route.params.id])
    },
    
    previousImage() {
      // TODO: Make this a general function that can be used
      // by products, images, orders etc.
      var index = _.findIndex(this.images['results'], ['id', this.$route.params.id])
      var newIndex = index - 1
      if (newIndex < 0) {
        newIndex = 0
      }
      var image = this.images['results'][newIndex]
      this.$router.push({ name: 'dashboard_image_view', params: { id: image.id } })
    },

    nextImage() {
      // TODO: Make this a general function that can be used
      // by products, images, orders etc.
      var index = _.findIndex(this.images['results'], { id: this.$route.params.id })
      var newIndex = index + 1
      if (newIndex > this.images['results'].length) {
        newIndex = 0
      }
      var image = this.images['results'][newIndex]
      this.$router.push({ name: 'dashboard_image_view', params: { id: image.id } })
    },
  }
}
</script>
