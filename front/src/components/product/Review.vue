<template>
  <b-modal id="modal-2" title="Some product" size="lg" hide-footer>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <b-btn class="mb-4" variant="light" @click="toggleGallery">
            <v-icon class="mr-2">mdi-grid</v-icon>
            <!-- <font-awesome-icon icon="grid" class="mr-2" /> -->
            Visionner la gallerie
          </b-btn>
        </div>
        
        <div class="row">
          <!-- Gallery -->
          <div v-if="showGallery" id="gallery" class="col-12">
            <div class="row">
              <div v-for="image in 20" :key="image" class="col-3">
                <b-img src="http://via.placeholder.com/300" fluid alt="Some image" @click="selectImage(image)" />
              </div>
            </div>
          </div>

          <!-- Review -->
          <div v-else class="row">
            <div class="col-8">
              <b-img src="http://via.placeholder.com/800" alt="Some product" fluid />
            </div>

            <div class="col-4">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut blanditiis 
              impedit placeat et nulla aliquam consectetur rerum porro, neque voluptatibus 
              molestiae sunt iste sapiente similique magnam a quisquam eveniet quia?
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'Review',
  
  props: {
    selectedReview: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    showGallery: false
  }),
  
  methods: {
    toggleGallery () {
      this.showGallery = !this.showGallery
    },

    selectImage (image) {
      this.$emit('selectImage', image)
    }
  }
}
</script>

<style scoped>
  #gallery {
    height: 400px;
    overflow-y: scroll;
  }

  #gallery img {
    cursor: pointer;
  }
</style>
