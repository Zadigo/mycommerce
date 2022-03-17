<template>
  <section id="wishlist">

    <v-container>
      <v-row>
        <v-col class="text-center" cols="12">
          <p class="my-3">
            To save your wishlist please <router-link :to="{ name: 'login', params: { lang: $i18n.locale} }">login</router-link> 
            or <router-link :to="{ name: 'login', params: { lang: $i18n.locale} }">sign up</router-link>
          </p>

          <v-row>
            <v-col v-for="product in products" :key="product.id" cols="3">

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
        </v-col>
      </v-row>
    </v-container>

  </section>
</template>

<script>
export default {
  name: 'WishlistView',
  beforeMount() {
    var wishlist = this.$localstorage.retrieve('vue-session')
    this.$store.commit('setWhishlist', wishlist)
  }
}
</script>
