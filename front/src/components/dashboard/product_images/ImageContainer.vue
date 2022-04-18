<template>
  <v-skeleton-loader v-if="isLoading" type="image"></v-skeleton-loader>
  
  <div v-else :title="image.name" class="image">
    <v-img :class="{ 'shadow': isSelected }" :src="image.mid_size" @click="doSelection(image)"></v-img>

    <div class="actions">
      <v-btn :to="{ name: 'dashboard_image_view', params: { id: image.id } }" class="mr-2">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn>
        <v-icon>mdi-transfer</v-icon>
      </v-btn>
    </div>

    <transition name="general-transition">
      <div v-if="isSelected" class="selector" @click="doSelection(image)">
        <v-icon>mdi-check</v-icon>
      </div>
    </transition>
  </div>
</template>


<script>
export default {
  name: 'ImageContainer',
  props: {
    image: {
      type: Object,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: true
    },
    selectedImages: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    isSelected () {
      return this.selectedImages.includes(this.image.id)
    }
  },
  
  methods: {
    doSelection () {
      // this.selected = !this.selected
      this.$emit('image-selected', this.image.id)
    }
  }
}
</script>

<style scoped>
  .image {
    position: relative;
    min-height: 200px;
    cursor: pointer;
  }

  .image .actions {
    position: absolute;
    width: 100%;
    text-align: center;
    padding: 1rem;
    bottom: 0;
    left: 0;
  }

  .image .selector {
    position: absolute;
    top: 3%;
    right: 3%;
    background-color: white;
    padding: .5rem;
    border-radius: 50%;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, .1);
    font-weight: 500;
  }
</style>
