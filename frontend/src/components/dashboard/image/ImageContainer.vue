<template>
  <!-- <v-skeleton-loader v-if="isLoading" type="image"></v-skeleton-loader> -->
  <!-- v-else -->
  <div :title="image.name" class="image">
    <img :class="{ 'shadow': isSelected }" :src="image.mid_size" class="img-fluid" @click="selected=!selected, $emit('image-selected', image)">

    <div class="actions">
      <router-link :to="{ name: 'dashboard_image_view', params: { id: image.id } }" class="btn btn-light me-2">
        <font-awesome-icon icon="fa-solid fa-pencil" />
      </router-link>

      <button type="button" class="btn btn-light me-2">
        <font-awesome-icon icon="fa-solid fa-right-left" />
      </button>
    </div>
    
    <transition name="general-transition">
      <div v-if="isSelected" class="selector" @click="$emit('image-selected', image.id)">
        <font-awesome-icon icon="fa-solid fa-check" />
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
    // isLoading: {
    //   type: Boolean,
    //   default: true
    // },
    selectedImages: {
      type: Array,
      default: () => []
    }
  },
  emits: {
    'image-selected' () {
      return true
    }
  },
  data () {
    return {
      selected: false
    }
  },
  computed: {
    isSelected () {
      return this.selectedImages.includes(this.image.id)
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
