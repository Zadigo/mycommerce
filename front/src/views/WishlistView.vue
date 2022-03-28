<template>
  <section id="wishlist" class="ecommerce-section">

    <v-container>
      <v-row>
        <v-col class="text-center" cols="12">
          <v-row v-if="wishlist.length > 0">
            <v-col v-for="product in wishlist" :key="product.id" cols="3">

              <v-img src="http://via.placeholder.com/400x400"></v-img>

              <div id="actions">
                <p class="font-weight-bold">{{ product.name }}</p>
                <p v-if="product.on_sale">{{ product.sale_price }}</p>
                <p v-else>{{ product.unit_price }}</p>

                <v-select :items="items" label="Size" outlined></v-select>
                <v-select :items="items" label="Variant" outlined></v-select>

                <v-btn block>{{ $t('Add to cart') }}</v-btn>
              </div>

            </v-col>
          </v-row>

          <v-row v-else>
            <v-col cols="12" class="text-center">
              <h1 class="mb-4 font-weight-bold">{{ $t('You have no saved items') }}</h1>
              <p>{{ $t('Sign in to sync your saved items across all your devices') }}</p>

              <v-btn :to="{ name: 'login', params: { lang: $i18n.locale } }" color="primary" x-large>
                <v-icon class="mr-2">mdi-login</v-icon>
                {{ $t('Sign in') }}
              </v-btn>
            </v-col>
          </v-row>

        </v-col>
      </v-row>
    </v-container>

  </section>
</template>

<script>
export default {
  name: 'WishlistView',
  title () {
    return 'Wishlist'
  },
  data: () => ({
    wishlist: []
  })
  // beforeMount() {
  //   var wishlist = this.$localstorage.retrieve('vue-session')
  //   this.$store.commit('setWhishlist', wishlist)
  // }
}
</script>
