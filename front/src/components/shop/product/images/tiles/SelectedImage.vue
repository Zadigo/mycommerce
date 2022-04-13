<template>
  <div id="selected-image" class="col-12">
    <v-img :src="selectedImage|mediaUrl"></v-img>

    <v-btn id="btn-close" icon>
      <v-icon @click="$emit('reset-selected-image')">mdi-close</v-icon>
    </v-btn>

    <base-tag v-if="isNew" :is-absolute="true" :top="3" :left="5" :padding="2" background-color="primary">
      <template>
        {{ $t('New') }}
      </template>
    </base-tag>
  </div>
</template>

<script>
export default {
  name: 'SelectedImage',
  props: {
    selectedImage: {
      type: String,
      required: true
    },
    isNew: {
      type: Boolean
    }
  }
}
</script>

<style scoped>
#selected-image {
  position: relative;
}

#btn-close {
  position: absolute;
  top: 2%;
  right: 5%;
}

</style>
