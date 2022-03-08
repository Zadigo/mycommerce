<template>
  <b-modal id="new-review" v-model="showModal" size="lg" scrollable @close="$emit('close')">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h3 class="h4 mb-3">Note générale</h3>
          <font-awesome-icon v-for="rating in ratings" id="rating" :key="rating.id" icon="star" size="2x" @click="selectRating(rating.id)" />
          <hr class="my-3">
        </div>

        <div class="col-12">
          <h3 class="h4 mb-3">Ajouter un titre</h3>
          <b-form-input v-model="dataToSend.title" placeholder="Qu'est ce qui est important à savoir ?"></b-form-input>
        </div>

        <div class="col-12">
          <h3 class="h4 mb-3">Ajouter une photo ou une vidéo</h3>
          <p>Les acheteurs trouvent les images et les vidéos plus utiles qu’un texte seul.</p>
          <b-form-group label="Small:" label-cols-sm="2" label-size="sm">
            <b-form-file v-model="dataToSend.media" accept=".jpg, .jpeg, .mp4" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..." multiple></b-form-file>
          </b-form-group>
        </div>

        <div class="col-12">
          <h3 class="h4 mb-3">Ajouter un commentaire écrit</h3>
          <b-form-textarea v-model="dataToSend.comment" type="text" placeholder="Pour quelles utilisations avez-vous employé ce produit ? Qu'est-ce que vous avez aimé ou n'avez pas aimé ?"></b-form-textarea>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
var _ = require('lodash')

export default {
  name: 'ModalNewReview',
  
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  
  data: () => ({
    ratings: [],
    dataToSend: {
      title: null,
      media: [],
      comment: null,
      rating: 1
    }
  }),

  computed: {
    selectedRating () {
      return _.find(this.ratings, ['selected', true])
    }
  },

  beforeMount() {
    for (let i = 0; i < 5; i++) {
      this.ratings.push({
        id: i,
        selected: false
      })  
    }
  },
  
  methods: {
    selectRating (index) {
      _.forEach(this.ratings, (rating) => {
        if (rating.id == index) {
          rating.selected = true
        } else {
          rating.selected = false
        }
      })
    }
  },
}
</script>

<style scoped>
  #rating {
    cursor: pointer;
  }
</style>
