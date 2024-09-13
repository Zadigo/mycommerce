<template>
  <div class="row">
    <div class="col-sm-12 col-md-12">
      <h2 class="h4 text-center mb-4">
        #bershkastyle
      </h2>
      
      <p class="text-body-tertiary">
        Nous adorerions voir comment vous portez vos vêtements Bershka. Partagez votre 
        look avec @bershka et #bershkastyle.
      </p>
    </div>

    <div class="col-sm-12 col-md-12">
      <v-carousel>
        <v-carousel-item src="../../assets/img5.jpeg" cover />
        <v-carousel-item src="../../assets/img6.jpeg" cover />  
        <v-carousel-item src="../../assets/img8.jpeg" cover />
      </v-carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomStyles',
  props: {
    imageOne: {
      type: String,
      required: true
    },
    imageTwo: {
      type: String,
      required: true
    },
    imageThree: {
      type: String,
      required: true
    }
  },
  setup () {
    this.imageOne
    this.imageTwo
    this.imageThree
  }
})
</script>
