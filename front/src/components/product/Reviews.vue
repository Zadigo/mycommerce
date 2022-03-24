<template>
  <section id="reviews">
    <div class="row">
      
      <!-- Filters -->
      <div class="col-8 offset-md-2 px-5">
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" class="mr-4" v-on="on">
              <font-awesome-icon icon="filter" class="mr-2" />
              {{ $t('Filter') }}
            </v-btn>
          </template>

          <v-list>
            <v-list-item-group>
              <v-list-item>
                {{ $t('top_reviews') }}
              </v-list-item>
              <v-list-item>
                {{ $t('most_recent') }}
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>

        <v-btn @click="openNewReviewModal=true">
          <font-awesome-icon icon="plus" class="mr-2" />
          {{ $t('Write new review') }}
        </v-btn>
      </div>

      <!-- Review -->
      <div v-for="(review, index) in reviews" :key="review.id" :class="{ 'mb-5': index > 0 }" class="col-8 offset-md-2 px-5">
        <div id="header">
          <h4 class="font-weight-bold">
            {{ review.title }}
          </h4>

          <p class="d-flex justify-content-left align-middle">
            <b-avatar src="http://via.placeholder.com/80" class="mr-2"></b-avatar>
            <span>Damtech</span>
          </p>

          <div class="d-flex justify-content-left">
            <div id="rating" class="mr-2">
              <v-icon v-for="i in 5" :key="i">{{ reviewStars(i, review.rating) }}</v-icon>
              <!-- <font-awesome-icon v-for="i in review.rating" :key="i" :icon="reviewStars(index, review.rating)" /> -->
            </div>
            <span class="text-muted">{{ $t('reviewed_in', { country: 'France' }) }} {{ review.created_on }}</span>
          </div>

          <div id="description" class="text-muted">
            <span>Couleur: Anthracite</span> <span>Configuration: Echo Dot</span> <span class="text-blue">
              {{ $t('verified_order') }}
            </span>
          </div>
        </div>

        <div id="review" class="mt-4">
          {{ review.comment }}
        </div>

        <!-- Media -->
        <div v-if="review.media.length > 0" id="illustrations" class="mt-4">
          <b-img v-for="image in review.media" :key="image.id" :src="image.original" class="mr-2" alt="Some review" fluid  @click="imageDetail(review)" />
        </div>

        <!-- Actions -->
        <div class="mt-5">
          <p class="text-muted my-2">{{ $tc('found_this_helpful', 431) }}</p>
          <b-btn>{{ $t('helpful') }}</b-btn>
          <b-btn class="ml-2" variant="light">
            {{ $t('report_abuse') }}
          </b-btn>
        </div>
      </div>

      <!-- Review Detail -->
      <review :selected-review="selectedReview" @selectImage="changeImageDetail" />
    </div>

    <!-- New review -->
    <modal-new-review :show-modal="openNewReviewModal" @close="openNewReviewModal=false" />
  </section>
</template>


<script>
import ModalNewReview from './ModalNewReview.vue'
import Review from './Review.vue'

export default {
  name: 'Reviews',

  components: { 
    ModalNewReview,
    Review, 
  },
  
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  
  data: () => ({
    selectedReview: {},
    openNewReviewModal: false
  }),
  
  methods: {
    imageDetail(review) {
      this.selectedReview = review
      this.$bvModal.show('modal-2')
    },

    changeImageDetail (review) {
      review
    },

    reviewStars (index, rating) {
      return index <= rating ? 'mdi-star' : 'mdi-star-outline'
    },
  }
}
</script>

<style scoped>
  #description span:not(:last-child):after {
    content: "|";
    padding: .5rem;
    color: #6c757d;
  }

  #illustrations img {
    cursor: pointer;
  }
</style>
