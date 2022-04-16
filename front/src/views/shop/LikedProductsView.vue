<template>
  <section class="ecommerce-section">
    <v-container>
      <!-- TODO: Make this and the whishlist a common inherited element -->
      <v-row v-if="likes.length > 0">
        <v-col v-for="product in likes" :key="product.id" cols="3">
          <v-img :src="product.get_main_image.mid_size|mediaUrl" height="400"></v-img>

          <div id="actions">
            <p class="font-weight-bold">
              <router-link :to="{ name: 'product_view', params: { id: product.id, slug: product.slug, lang: $i18n.locale } }">{{ product.name }}</router-link>
            </p>
            <p>{{ product.get_price }}</p>

            <!-- <v-select :items="items" label="Size" outlined></v-select>
            <v-select :items="items" label="Variant" outlined></v-select> -->

            <v-btn block @click="simpleAddToCard(product, 'Unique')">
              {{ $t('Add to cart') }}
            </v-btn>
          </div>

        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12" class="text-center">
          <v-icon class="mb-4" x-large>mdi-heart</v-icon>

          <h1 class="mb-4 font-weight-bold">{{ $t('You have no saved items') }}</h1>
          <p>{{ $t('Sign in to sync your saved items across all your devices') }}</p>

          <v-btn :to="{ name: 'login_view', params: { lang: $i18n.locale } }" color="primary" x-large>
            <v-icon class="mr-2">mdi-login</v-icon>
            {{ $t('Sign in') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import { mapState } from 'vuex'
// import { truncate } from '@/utils'
import cartMixin from '@/mixins/cart'

export default {
  name: 'LikedProductsView',
  mixins: [cartMixin],
  // setup() {
  //   return {
  //     truncate
  //   }
  // },
  title () {
    return 'Likes'
  },
  data: () => ({
    likes: []
  }),
  computed: {
    ...mapState('authenticationModule', ['isAuthenticated'])
  },
  beforeMount() {
    var likes = this.$localstorage.retrieve('likes')
    if (likes) {
      console.log('likes')
      this.likes = likes
    } else {
      console.log('get likes')
      this.getLikes()
    }
    // this.$store.commit('setWhishlist', wishlist)
    // if (this.isAuthenticated) {
    // }
  },
  methods: {
    async getLikes() {
      try {
        var response = await this.axios.get('shop/likes')
        this.likes = response.data.products
        this.$localstorage.create('likes', this.likes)
      } catch(error) {
        this.$store.commit('addErrorMessage', error)
      }
    }
  }
}
</script>
