<template>
  <section id="recently-viewed">
    <div class="row">
      <div v-for="product in recentlyViewedProducts" :key="product.id" class="col-4">
        <h4 class="my-4 h4">Recently viewed</h4>

        <b-card title="product.name">
          <b-card-text>
            {{ product.name }}
          </b-card-text>
        </b-card>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'RecentlyViewd',
  computed: {
    ...mapGetters(['recentlyViewedProducts'])
  }
}
</script>
